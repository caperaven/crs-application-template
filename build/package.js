/**
 * Build script using deno
 * https://droces.github.io/Deno-Cheat-Sheet/
 */

import { copy, emptyDir, ensureDir } from "https://deno.land/std@0.149.0/fs/mod.ts";

import * as esbuild from 'https://deno.land/x/esbuild@v0.14.50/mod.js'

async function createFolderStructure() {
    await ensureDir("./dist");
    await emptyDir("./dist");

    await ensureDir("./dist/styles/views");
    await ensureDir("./dist/components");
    await ensureDir("./dist/src");

    for (const folder of ["404", "about", "form", "welcome"]) {
        await ensureDir(`./dist/app/${folder}`);
    }
}

async function packageDirectory(def, loader, format, minified) {
    for (const dir of def.dir) {
        for await (const dirEntry of Deno.readDir(dir)) {
            if (dirEntry.isDirectory) {
                continue;
            }

            const sourceFile = `${dir}/${dirEntry.name}`;

            let targetFile = `${def.target}${dir}/${dirEntry.name}`;
            let keys = Object.keys(def.replace || {});
            for (const key of keys) {
                targetFile = targetFile.replace(key, def.replace[key]);
            }

            await packageFile(sourceFile, targetFile, loader, format, minified);
        }
    }
}

async function packageFiles(def, loader, format, minified) {
    for (const file of def.files) {
        const target = file.replace("./src", "./dist");
        await packageFile(file, target, loader, format, minified);
    }
}

async function packageFile(sourceFile, targetFile, loader, format, minified) {
    const src = await Deno.readTextFile(sourceFile);
    const result = await esbuild.transform(src, { loader: loader, minify: minified, format: format });
    await Deno.writeTextFile(targetFile, result.code);
}

async function packageMarkup(sourceFile, targetFile, minified) {
    let src = await Deno.readTextFile(sourceFile);

    if (minified == true) {
        src = src
            .split("\t").join("")
            .split("\r").join("")
            .split("\n").join("")
            .split("  ").join(" ");
    }

    await Deno.writeTextFile(targetFile, src);
}

async function bundleJs(file, output, minified) {
    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        outfile: output,
        format: "esm",
        minify: minified
    })

    console.log(result);
}

async function bundleCss(file, output, minified) {
    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        loader: {".css": "css"},
        outfile: output,
        minify: minified
    })

    console.log(result);
}

await createFolderStructure();

// routes
await packageMarkup("./app/routes.json", "./dist/app/routes.json", true);

// html files
await packageMarkup("./app/404/404.html", "./dist/app/404/404.html", true);
await packageMarkup("./app/about/about.html", "./dist/app/about/about.html", true);
await packageMarkup("./app/form/form.html", "./dist/app/form/form.html", true);
await packageMarkup("./app/welcome/welcome.html", "./dist/app/welcome/welcome.html", true);

// css files
await bundleCss("./styles/styles.css", "./dist/styles/styles.css", true);
await packageMarkup("./styles/views/404.css", "./dist/styles/views/404.css", true);
await packageMarkup("./styles/views/about.css", "./dist/styles/views/about.css", true);
await packageMarkup("./styles/views/welcome.css", "./dist/styles/views/welcome.css", true);

// js files
await bundleJs("./index.js", "./dist/index.js", true);
await packageFile("./app/form/form.js", "./dist/app/form/form.js", "js", "esm", true);
await packageFile("./app/welcome/welcome.js", "./dist/app/welcome/welcome.js", "js", "esm", true);

// copy files
await Deno.copyFile("./index.html", "./dist/index.html");
await Deno.copyFile("./favicon.ico", "./dist/favicon.ico");
await copy("./packages", "./dist/packages");

// components
await packageFile("./components/component.js", "./dist/components/component.js", "js", "esm", true);

// src
await packageFile("./src/my-class.js", "./dist/src/my-class.js", "js", "esm", true);

Deno.exit(0);
