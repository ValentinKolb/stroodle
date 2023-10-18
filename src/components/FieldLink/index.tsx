import {ReactNode} from "react";
import {LinkProps} from "react-router-dom";
import classes from "./index.module.css";
import {IconChevronRight} from "@tabler/icons-react";
import {CustomLink} from "../layout/Navigation/Custom/CustomLink.tsx";

export default function FieldLink({children, ariaLabel, legend, ...props}: {
    legend: string
    children: ReactNode
    ariaLabel?: string
} & LinkProps) {
    return <CustomLink aria-label={ariaLabel || legend} {...props}>
        <div className={classes.container}>
            <div className={classes.legend}>
                {legend}
                <IconChevronRight/>
            </div>
            {children}
        </div>
    </CustomLink>
}