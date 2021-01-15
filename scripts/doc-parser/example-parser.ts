import * as marked from "marked"


export interface ComponentUsageExample {
    origin: string
    code: string
    title: string
}


/**
 * parses code snippet example from document provided.
 * example document [here](https://github.com/ant-design/ant-design/edit/master/components/alert/demo/action.md).
 * @param exampleName 
 * @param content 
 */
export function parseExampleSnippet(origin: string, content: string): ComponentUsageExample {
    const tokens: any[] = marked.lexer(content);

    let code;
    let title;

    tokens.forEach(t => {
        const type = t.type as "paragraph" | "code" | "hr"
        const text = t.text as string
        // get title paragraph
        if (type == "paragraph" && text.includes(`\ntitle:\n`)) {
            // parse title
            const titleRegTokens = text.split("en-US: ")
            const titleTarget = titleRegTokens[titleRegTokens.length - 1]
            try {
                title = titleTarget.split('\n')[0]
            } catch (_) {
                title = titleTarget
            }
        }

        // get code snippets
        // type = code
        else if (type == "code") {
            code = text
        }
    })

    return <ComponentUsageExample>{
        origin: origin,
        title: title,
        code: code
    }
}