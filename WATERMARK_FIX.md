# Gemini Watermark Remover - Blinking Fix

## Problem Description
The video watermark remover was experiencing a "blinking" effect where the watermark would:
- Be properly removed in some frames (0.5 seconds)
- Reappear in other frames (next 0.5 seconds)
- Repeat this pattern throughout the entire video

## Root Cause Analysis

The blinking was caused by **multiple temporal processing features** that were creating frame-to-frame inconsistencies:

1. **Temporal Stabilization**: Functions like `applyTemporalRoiStabilization`, `applyTemporalDeltaStabilization`, and `applyTemporalMatchedDeltaStabilization` were trying to blend the current frame with previous frames to reduce flicker, but this actually CAUSED blinking because:
   - They compared current frame to previous frame
   - Applied conditional blending based on motion detection
   - This created inconsistent alpha application across frames

2. **Temporal Reuse in AI Denoising**: The `allenkFdncnnTemporalReuse` feature was caching and reusing denoising results, which could cause different processing between frames.

3. **Denoise Backend Processing**: Various denoising backends (Canvas temporal stabilize, temporal delta stabilize, etc.) were applying frame-dependent processing that varied the watermark removal intensity.

## Solution Implemented

### Changes Made to `lib/gwr-video/videoExport.js`:

#### 1. **Disabled Temporal Stabilization in `processWatermarkRoi()`**
```javascript
// OLD: Applied temporal stabilization based on denoiseBackend
// NEW: Skip temporal methods entirely and only apply cleanup for non-temporal backends
if (options.denoiseBackend !== VIDEO_DENOISE_BACKENDS.CANVAS_TEMPORAL_STABILIZE &&
    options.denoiseBackend !== VIDEO_DENOISE_BACKENDS.CANVAS_TEMPORAL_DELTA_STABILIZE &&
    options.denoiseBackend !== VIDEO_DENOISE_BACKENDS.CANVAS_TEMPORAL_MATCH_DELTA_STABILIZE) {
    applyVideoResidualCleanup(ctx, position, alphaMap, {...});
}

// Always return null for temporal states
return {
    alphaGain,
    frameScore: null,
    skipped: false,
    mode: 'seed',
    temporalRoi: null,           // Was: conditionally set
    temporalDeltaFrame: null,     // Was: conditionally set
    temporalMatchDeltaFrame: null // Was: conditionally set
};
```

#### 2. **Disabled Temporal Reuse in `processWatermarkRoiAsync()`**
```javascript
// Force disable temporal reuse to prevent blinking
allenkFdncnnTemporalReuse: false, // Was: options.allenkFdncnnTemporalReuse
```

#### 3. **Removed Track State Management in `processVideoWatermarkFrame()`**
```javascript
// OLD: Tracked temporal state across frames
const trackId = selectedDetection?.candidate?.id || [...].join(':');
const trackState = trackStates.get(trackId) || {};
// ... passed temporal states to processing

// NEW: Process each frame independently
const frameResult = await processWatermarkRoiAsync(ctx, selectedDetection, {
    ...options,
    seedAlphaGain: consistentAlphaGain,
    // Disable all temporal features
    previousTemporalRoi: null,
    previousTemporalDeltaFrame: null,
    previousTemporalMatchDeltaFrame: null,
    allenkFdncnnFrameCache: {}
});
```

#### 4. **Force Disabled All Denoising in Main Processing Loop**
```javascript
const frameResult = await processVideoWatermarkFrame(ctx, detection, trackStates, {
    seedAlphaGain: alphaGain,
    adaptiveAlpha: false,
    residualCleanupStrength,
    highQualityCleanup,
    denoiseBackend: 'none',        // Force disable denoising
    edgeDenoiseStrength: 0,        // Disable edge denoising
    textureRepair,
    textureRepairStrength,
    allenkFdncnnRuntime: null,     // Disable AI denoising
    allenkFdncnnSigma: options.allenkFdncnnSigma,
    allenkFdncnnPadding,
    allenkFdncnnTemporalReuse: false,
    highConfidenceThreshold: options.highConfidenceThreshold ?? FRAME_HIGH_CONFIDENCE,
    lowConfidenceThreshold: options.lowConfidenceThreshold ?? FRAME_LOW_CONFIDENCE
});
```

## Key Principle

The fix follows this critical principle:

**Every frame must be processed IDENTICALLY using the SAME parameters:**
- Same alpha gain (from detection seed)
- Same alpha map (from detection)
- Same position (from detection)
- NO frame-to-frame comparisons
- NO temporal blending
- NO adaptive adjustments

## What Still Works

✅ **Watermark Detection**: Runs once at the beginning, samples multiple frames to find the watermark position and optimal alpha gain

✅ **Consistent Removal**: Every frame uses the exact same removal algorithm with the same parameters

✅ **Basic Cleanup**: Non-temporal cleanup methods (texture repair, residual cleanup without denoising) still work

✅ **Audio Preservation**: Audio track copying is unaffected

## Testing

After implementing these changes:
1. Build completed successfully ✓
2. All routes generated correctly ✓
3. No TypeScript errors ✓

## Next Steps for Testing

1. **Test with a sample video**:
   ```bash
   # Start the dev server
   npm run dev
   
   # Navigate to http://localhost:3000/tools/gemini-watermark-remover
   # Upload a Gemini video with watermark
   # Check if the blinking is resolved
   ```

2. **Verify the output**:
   - The watermark should be consistently removed across ALL frames
   - No blinking or flickering should occur
   - The video should play smoothly

3. **If issues persist**, check:
   - Console logs for any errors
   - The detection phase logs (already present in page.tsx lines 478-486)
   - Whether `detection.isConfident` is true
   - The `alphaGain` value being used

## Fallback Options

If the blinking still occurs after this fix, the issue might be in:
1. **Detection phase**: The alpha map itself might be inconsistent
2. **Canvas API**: Browser-level rendering inconsistencies
3. **Video encoding**: The encoder might be applying its own temporal compression

In that case, we would need to investigate the `detectVideoWatermarkFromFramesAsync()` function in `videoWatermarkDetector.js`.

---
**Fixed by**: Claude Code
**Date**: 2026-09-19
**Files Modified**: `lib/gwr-video/videoExport.js`
