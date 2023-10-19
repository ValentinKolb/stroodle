import {ReactNode} from "react";
import {LinkProps} from "react-router-dom";
import classes from "./index.module.css";
import {IconChevronRight} from "@tabler/icons-react";
import {CustomLink} from "../layout/Navigation/Custom/CustomLink.tsx";

export default function FieldLink({
                                      children,
                                      ariaLabel,
                                      legend,
                                      scrollable,
                                      ...props
                                  }: {
    legend: string
    scrollable?: boolean
    children: ReactNode
    ariaLabel?: string
} & LinkProps) {

    return (
        <div className={classes.container} data-scrollable={scrollable}>

            <div className={classes.legend}>
                {legend}
                <IconChevronRight/>
            </div>

            <CustomLink
                aria-label={ariaLabel || legend} {...props}
                className={`${classes.link}`}
                data-scrollable={scrollable}
            >
                {children}
            </CustomLink>
        </div>
    )
}

export function FieldDiv({children, legend, scrollable}: {
    legend: string
    children: ReactNode
    scrollable?: boolean
}) {
    return (
        <div className={classes.container} data-scrollable={scrollable}>

            <div className={classes.legend}>
                {legend}
            </div>

            <div
                aria-label={legend}
                className={`${classes.link}`}
                data-scrollable={scrollable}
            >
                {children}
            </div>
        </div>
    )
}