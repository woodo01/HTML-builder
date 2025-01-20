const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputAssetsDir = path.join(projectDist, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');

async function createProjectDist() {
  await fs.promises.mkdir(projectDist, { recursive: true });
}

async function buildHtml() {
  let templateContent = await fs.promises.readFile(templatePath, 'utf-8');

  const tags = templateContent.match(/{{\s*[\w-]+\s*}}/g) || [];
  for (const tag of tags) {
    const componentName = tag.replace(/{{\s*|\s*}}/g, ''); // Extract component name
    const componentPath = path.join(componentsDir, `${componentName}.html`);

    try {
      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      templateContent = templateContent.replace(
        new RegExp(tag, 'g'),
        componentContent,
      );
    } catch (err) {
      console.error(`Component "${componentName}" not found.`);
    }
  }

  await fs.promises.writeFile(outputHtml, templateContent, 'utf-8');
}

async function buildCss() {
  const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });
  const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');

  const styles = await Promise.all(
    cssFiles.map((file) =>
      fs.promises.readFile(path.join(stylesDir, file.name), 'utf-8'),
    ),
  );

  await fs.promises.writeFile(outputCss, styles.join('\n'), 'utf-8');
}

async function copyAssets(srcDir, destDir) {
  await fs.promises.rm(destDir, { recursive: true, force: true });
  await fs.promises.mkdir(destDir, { recursive: true });
  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  try {
    await createProjectDist();
    await buildHtml();
    await buildCss();
    await copyAssets(assetsDir, outputAssetsDir);
    console.log('Project built successfully!');
  } catch (err) {
    console.error('Error building project:', err);
  }
}

main();
