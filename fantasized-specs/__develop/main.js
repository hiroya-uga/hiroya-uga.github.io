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
const markedRenderer = new marked.Renderer();
let toc = [];

markedRenderer.heading = (text, level) => {
    const title = text.trim();
    const id = title.toLowerCase().replace(/[\s\.]/g, '-').replace(/--/g, '-');

    if (/^[0-9]/.test(title)) {
        toc.push({
            level: level,
            id: id,
            title: title
        });

        return `<h${level} id="${id}"><strong>${title}</strong><a href="#${id}" class="anchor"><span>Anchor Link</span></a></h${level}>`;
    }

  return `<h${level}>${title}</h${level}>`;
};

marked.setOptions({
    highlight: (code, lang, callback) => {
        return hljs.highlightAuto(code).value;
    },
    renderer: markedRenderer,
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

        toc = [];

        await writeFile(destPath, ((html) => {
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

            html = html.replace(/\${lastUpdate}/i, `${date.getDate()} ${new Intl.DateTimeFormat('en-US', {
                month: 'long'
            }).format(date)} ${date.getFullYear()}`);

            html = html.replace(/<p>.*?\[toc\].*?<\/p>/i, (() => {
                let tocSrc = '';

                // level 2 以上
                toc.forEach(({level, id, title}) => {
                    const indent = ''.padStart((level - 2) * 4, '    ');

                    // renderer の中で数字始まりなことは検証済み
                    title = title.replace(/([^0-9.])/, (m, p1) => {
                        return `</span><span>${p1}`;
                    });

                    title = `<span>${title}`;

                    tocSrc += `${indent}- [${title}](#${id})\n`;
                });

                return `<h2>Table of Contents</h2><div id="toc">${marked(tocSrc)}</div>`;
            })());


            if (h1) {
                html = html.replace('${title}', h1.textContent.trim());
            }

            return html;
        })(marked(md)));

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
