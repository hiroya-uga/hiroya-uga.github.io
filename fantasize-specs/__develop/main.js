'use strict';

const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const hljs = require('highlightjs');
const marked = require('marked');
const {JSDOM} = require('jsdom');
const browser = require('browser-sync').create();
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const base = path.join(__dirname, 'md');
const templatePath = path.join(__dirname, 'template');

marked.setOptions({
    highlight: (code, lang, callback) => {
        return hljs.highlightAuto(code).value;
    },
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    extra: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

Promise.all([
    readFile(path.join(templatePath, 'before.html')),
    readFile(path.join(templatePath, 'after.html')),
    readFile(path.join(templatePath, 'indexBefore.html')),
    readFile(path.join(templatePath, 'indexAfter.html'))
]).then((templates) => {
    const template = {
        before: templates[0],
        after: templates[1],
        indexBefore: templates[2],
        indexAfter: templates[3]
    };
    const dest = async (mdPath, fileName) => {
        const md = await readFile(mdPath, 'utf-8');
        const destPath = path.join(__dirname, '..', fileName.replace(/md$/, 'html'));
        const src = ((html) => {
            const dom = new JSDOM(html, {
                contentType: 'text/html'
            }).window.document;
            const h1 = dom.querySelector('h1');
            const date = new Date();

            if (fileName === 'index.html') {
                html = template.indexBefore + html + template.indexAfter;
            } else {
                html = template.before + html + template.after;
            }

            html = html.replace('${LastUpdate}', `${date.getDate()} ${new Intl.DateTimeFormat('en-US', {
                month: 'long'
            }).format(date)} ${date.getFullYear()}`);

            if (h1) {
                html = html.replace('${title}', h1.textContent.trim());
            }

            return html;
        })(marked(md));

        await writeFile(destPath, src);

        browser.reload();
    };

    browser.init({
        server: {
            baseDir: '../'
        }
    });

    fs.readdir(base, function(err, files) {
        const readmePath = path.join(__dirname, '..', 'README.md');

        if (err) {
            throw err;
        }

        files.forEach((fileName) => {
            const filePath = path.join(base, fileName);

            fs.watch(
                filePath,
                () => {
                    dest(filePath, fileName);
                }
            );
        });

        // readme
        fs.watch(
            readmePath,
            () => {
                dest(readmePath, 'index.html');
            }
        );
    });
});
