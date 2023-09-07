import {Box, BoxProps, packSx} from "@mantine/core";
import React, {ReactNode} from "react";

export default function Slide({
                                  children,
                                  active,
                                  childProps,
                                  duration = 200,
                                  ...props
                              }: { children: ReactNode, active: number, childProps?: BoxProps, duration?: number } & BoxProps) {

    return <>
        <Box
            sx={() => ({
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                overflow: "hidden",
            })}
            {...props}
        >
            {
                React.Children.toArray(children).map((child, index) => (
                    <Box
                        key={index}
                        {...childProps}
                        sx={[() => ({
                            width: "100%",
                            minWidth: "100%",
                            transform: `translateX(-${active * 100}%)`,
                            transition: `all ${duration / 1000}s ease`,
                            opacity: active === index ? 1 : 0,
                            maxHeight: active === index ? "100%" : 0,
                        }), ...packSx(childProps?.sx)]}
                    >
                        {child}
                    </Box>
                ))
            }
        </Box>
    </>
}