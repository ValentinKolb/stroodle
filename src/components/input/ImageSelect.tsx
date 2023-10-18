import {useDropzone} from "react-dropzone";
import {Box, BoxProps, Center, InputWrapperProps, Stack, Text, Title} from "@mantine/core";
import {IconPhoto, IconPhotoEdit, IconPhotoUp, IconPhotoX} from "@tabler/icons-react";

export default function ImageSelect({
                                        error,
                                        onChange,
                                        fileCount,
                                        maxFileCount,
                                        small,
                                        ...props
                                    }: {
                                            small?: boolean
                                            onChange: (files: File[]) => void, fileCount: number, maxFileCount: number
                                        }
                                        & Omit<BoxProps, "children" | "sx" | "className">
                                        & Pick<InputWrapperProps, "error">
) {
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: {'image/*': ['.jpeg', '.png', '.webp', '.tiff', '.heic', '.gif']},
        maxSize: 5232880,
        onDropAccepted: (files) => onChange(files),
    })

    return (
        <>
            <Box
                className="container"
                style={(theme) => ({
                    height: "100%",
                    border: `1px dashed ${theme.colors.gray[5]}`,
                    borderColor: isDragAccept ? theme.colors.blue[5] : isDragReject ? theme.colors.red[5] : theme.colors.gray[5],
                    padding: theme.spacing.md,
                    borderRadius: theme.radius.md,
                    cursor: "pointer",
                    "&:hover": {
                        boxShadow: theme.shadows.sm,
                    }
                })}
                {...props}
            >
                <Center{...getRootProps({className: "dropzone"})} style={{height: "100%",}}>
                    <input {...getInputProps()} />
                    <Stack ta={"center"}>
                        {isDragAccept && <IconPhotoUp/>}
                        {isDragReject && <IconPhotoX/>}
                        {!isDragActive && (small ? <IconPhotoEdit/> : <IconPhoto/>)}

                        {!small && <>
                            < Title c={"green"}
                                    order={3}>{maxFileCount > 1 ? "Bilder" : "Bild"} hochladen</Title>
                            <Text size={"sm"}>Bilder können per Drag & Drop oder durch {
                                <Text span c={"green"}>klicken</Text>
                            } hochgeladen werden.</Text>
                            {maxFileCount > 1 &&
                                <Text size={"sm"} c={"dimmed"}>{fileCount} von {maxFileCount} Fotos</Text>
                            }
                            <Text size={"sm"} c={"dimmed"}>Maximale Dateigröße: 5MB</Text>
                            {error && <Text size={"sm"} c={"red"}>{error}</Text>}
                        </>
                        }
                    </Stack>
                </Center>
            </Box>
        </>
    )
}

