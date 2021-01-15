import { request } from "@octokit/request"
import * as minimatch from "minimatch"
import * as dotenv from "dotenv"

// set envs for authentication
dotenv.config()


/**
 * https://github.com/octokit/request.js/#authentication
 * https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token
 */
const requestWithAuth = request.defaults({
    headers: {
        authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
    },
});

/**
 * ignore directories with this patterns
 * e.g. __tests__, _utls, .tools
 */
const DIR_IGNORE = ['_*', '__*', '.*', 'version']

const EXAMPLES_DIR = "demo"
const DOC_MD_NAME = "index.en-US.md"

interface AntComponentIterationMap {
    name: string
    index: string
    doc: string
    examplesUrl: string[]
    examples: string[]
}

async function makeComponentIterationMap(componentName: string, componentTree: Tree[]): Promise<AntComponentIterationMap> {
    const demo = componentTree.find(t => t.path == EXAMPLES_DIR)
    let demoUrls: string[] = []
    let demos: string[] = []
    // for some components, there are no demo directories, and no examples.
    if (demo) {
        demoUrls = (await (await requestWithAuth(demo.url)).data.tree as Tree[]).map(t => t.url)
        for (const du of demoUrls) {
            const file: Blob = (await requestWithAuth(du)).data
            let buff = Buffer.from(file.content, file.encoding);
            let text = buff.toString('ascii');
            demos.push(text)
        }
    }


    return {
        name: componentName,
        index: `https://github.com/ant-design/ant-design/blob/master/components/${componentName}/index.tsx`,
        doc: `https://ant.design/components/${componentName}`,
        examplesUrl: demoUrls,
        examples: demos
    }
}

function testDirName(dirname: string): boolean {
    const invalid = DIR_IGNORE.some((i) => {
        return minimatch(dirname, i)
    })
    if (invalid) {
        return false
    }
    return true
}


interface Tree {
    path: string
    sha: string
    type: "tree" | "blob"
    url: string
}

/**
 * example
 * ```
{
    "sha": "f2a3c7283df64e651fee9b7c5358652c23ff9192",
    "node_id": "MDQ6QmxvYjM0NTI2ODg0OmYyYTNjNzI4M2RmNjRlNjUxZmVlOWI3YzUzNTg2NTJjMjNmZjkxOTI=",
    "size": 659,
    "url": "https://api.github.com/repos/ant-design/ant-design/git/blobs/f2a3c7283df64e651fee9b7c5358652c23ff9192",
    "content": "LS0tCm9yZGVyOiAyCnRpdGxlOgogIHpoLUNOOiDnrq3lpLTmjIflkJEKICBl\nbi1VUzogQXJyb3cgcG9pbnRpbmcgYXQgdGhlIGNlbnRlcgotLS0KCiMjIHpo\nLUNOCgrorr7nva7kuoYgYGFycm93UG9pbnRBdENlbnRlcmAg5ZCO77yM566t\n5aS05bCG5oyH5ZCR55uu5qCH5YWD57Sg55qE5Lit5b+D44CCCgojIyBlbi1V\nUwoKQnkgc3BlY2lmeWluZyBgYXJyb3dQb2ludEF0Q2VudGVyYCBwcm9wLCB0\naGUgYXJyb3cgd2lsbCBwb2ludCB0byB0aGUgY2VudGVyIG9mIHRoZSB0YXJn\nZXQgZWxlbWVudC4KCmBgYGpzeAppbXBvcnQgeyBUb29sdGlwLCBCdXR0b24g\nfSBmcm9tICdhbnRkJzsKClJlYWN0RE9NLnJlbmRlcigKICA8ZGl2PgogICAg\nPFRvb2x0aXAgcGxhY2VtZW50PSJ0b3BMZWZ0IiB0aXRsZT0iUHJvbXB0IFRl\neHQiPgogICAgICA8QnV0dG9uPkFsaWduIGVkZ2UgLyDovrnnvJjlr7npvZA8\nL0J1dHRvbj4KICAgIDwvVG9vbHRpcD4KICAgIDxUb29sdGlwIHBsYWNlbWVu\ndD0idG9wTGVmdCIgdGl0bGU9IlByb21wdCBUZXh0IiBhcnJvd1BvaW50QXRD\nZW50ZXI+CiAgICAgIDxCdXR0b24+QXJyb3cgcG9pbnRzIHRvIGNlbnRlciAv\nIOeureWktOaMh+WQkeS4reW/gzwvQnV0dG9uPgogICAgPC9Ub29sdGlwPgog\nIDwvZGl2PiwKICBtb3VudE5vZGUsCik7CmBgYAo=\n",
    "encoding": "base64"
}
```
 */
interface Blob {
    sha: string
    node_id: string
    size: number
    url: string
    content: string
    encoding: BufferEncoding
}


async function main() {
    // components
    const d = await requestWithAuth("GET /repos/{owner}/{repo}/git/trees/{sha}", {
        owner: "ant-design",
        repo: "ant-design",
        sha: "6483dc0e1300985785e365cd6820b28e2147e0d4"
    })
    const tree: Tree[] = d.data.tree

    const componentDirs = tree.filter((t) => t.type == "tree" && testDirName(t.path))

    componentDirs.forEach(async (c) => {
        const componentName = c.path
        try {
            const d = await requestWithAuth(c.url)
            const componentTree: Tree[] = d.data.tree
            const res = await makeComponentIterationMap(componentName, componentTree)
            console.log(res)
        } catch (e) {
            console.error('failed to make iteration map for component', componentName)
        }
    })
}


if (require.main == module) {
    main()
}