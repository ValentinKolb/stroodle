import {ActionIcon, Title} from "@mantine/core";
import classes from "./index.module.css";
import {useMediaQuery} from "@mantine/hooks";
import {IconChevronLeft} from "@tabler/icons-react";
import {ReactNode} from "react";
import {CustomLink} from "../Navigation/Custom/CustomLink.tsx";
import {useSideMenuBar} from "../../../lib/uiUtil.tsx";

export default function Header({label, href, leftSection, rightSection}: {
    label: ReactNode
    href?: string
    leftSection?: ReactNode
    rightSection?: ReactNode
}) {

    const isMobile = useMediaQuery(`(max-width: 576px)`)

    const {openSideMenuBar} = useSideMenuBar()

    return <div className={classes.container}>

        <div className={classes.header}>
            {isMobile &&
                <ActionIcon
                    aria-label={"open side menu"}
                    onClick={openSideMenuBar}
                    variant="transparent"
                    size={"lg"}

                >
                    <IconChevronLeft/>
                </ActionIcon>
            }

            {leftSection && <div className={classes.leftSection}>
                {leftSection}
            </div>}

            {href ?
                <CustomLink to={href} className={classes.title}>
                    <Title className={classes.title}>
                        {label}
                    </Title>
                </CustomLink>
                :
                <Title className={classes.title}>
                    {label}
                </Title>
            }


            {rightSection && <div className={classes.rightSection}>
                {rightSection}
            </div>}

        </div>
    </div>
}