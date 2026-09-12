import os

directory = '/home/Neelesh/Desktop/EatBit/app/blogs'
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Replace /blog references
            content = content.replace('href="/blog"', 'href="/blogs"')
            content = content.replace('href={`/blog/${post.slug}`}', 'href={`/blogs/${post.slug}`}')
            content = content.replace('https://eatbit.in/blog', 'https://eatbit.in/blogs')
            content = content.replace('href="/blog/', 'href="/blogs/')
            
            with open(filepath, 'w') as f:
                f.write(content)

print("Updated internal blog links to /blogs")
