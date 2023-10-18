import xss from "xss";
import {TypographyStylesProvider, TypographyStylesProviderProps} from "@mantine/core";
import classes from "./index.module.css";

/**
 * Component to render HTML from a string in a safe way.
 * @param html The HTML string to render.
 */
export default function Index({children, ...props}: { children: string } & TypographyStylesProviderProps) {
    return (
        <TypographyStylesProvider
            dangerouslySetInnerHTML={{__html: xss(children)}}
            {...props}
            className={`${classes.container} ${props.className}`}
        />
    )
}