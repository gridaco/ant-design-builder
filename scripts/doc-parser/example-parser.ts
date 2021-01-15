import * as marked from "marked"


/**
 * parses code snippet example from document provided.
 * example document [here](https://github.com/ant-design/ant-design/edit/master/components/alert/demo/action.md).
 * @param exampleName 
 * @param content 
 */
export function parseExampleSnippet(exampleName: string, content: string): string {
    const tokens: any[] = marked.lexer(content);

    tokens.forEach(t => {
        const type = t.type as "paragraph" | "code" | "hr"
        const text = t.text as string
        // get title paragraph
        if (type == "paragraph" && text.includes(`\ntitle:\n`)) {
            // parse title
            const titleRegTokens = text.split("en-US: ")
            const title = titleRegTokens[titleRegTokens.length - 1]
            console.log('title', title)
        }

        else if (type == "code") {

        }
    })


    // get code snippets
    // type = code

    return tokens[0]
}