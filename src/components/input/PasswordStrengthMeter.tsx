import {Box, BoxProps, Center, Group, GroupProps, Progress} from "@mantine/core";
import {IconCheck, IconX} from "@tabler/icons-react";

function StrengthMeter({strength, enabled, ...props}: {
    strength: number,
    enabled: boolean
} & Omit<GroupProps, "children">) {

    return <Group gap={5} grow {...props}>
        {
            Array(4)
                .fill(0)
                .map((_, index) => (
                    <Progress
                        value={
                            enabled && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
                        }
                        color={strength > 80 ? 'green' : strength > 50 ? 'yellow' : 'red'}
                        key={index}
                        size={4}
                    />
                ))
        }
    </Group>
}

function PasswordRequirement({meets, label, ...props}: {
    meets: boolean;
    label: string
} & BoxProps) {
    return (
        <Box
            c={meets ? "teal" : "red"}
            fz={"sm"}
            mt={5}{...props}>
            <Center inline>
                {meets ? <IconCheck size={15} stroke={1.5}/> : <IconX size={15} stroke={1.5}/>}
                <Box ml={7}>{label}</Box>
            </Center>
        </Box>
    )
}

const PASSWORD_REQUIREMENTS = [
    {re: /[0-9]/, label: 'Enthält Zahlen'},
    {re: /[a-z]/, label: 'Enthält Kleinbuchstaben'},
    {re: /[A-Z]/, label: 'Enthält Großbuchstaben'},
    {re: /[\W_]/, label: 'Enthält Symbole'},
]

export function getPasswordStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;
    PASSWORD_REQUIREMENTS.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    })
    return Math.max(100 - (100 / (PASSWORD_REQUIREMENTS.length + 1)) * multiplier, 0);
}

export default function PasswordStrengthMeter({password, passwordConfirm, ...props}: {
    password: string,
    passwordConfirm: string
} & BoxProps) {
    const passwordStrength = getPasswordStrength(password)
    return <Box {...props}>
        <StrengthMeter mt="xs" mb="sm" strength={passwordStrength}
                       enabled={password.length > 0}/>

        <PasswordRequirement label="Hat mindestens 6 Zeichen"
                             meets={password.length > 5}/>
        {
            PASSWORD_REQUIREMENTS.map((requirement, index) => (
                <PasswordRequirement key={index} label={requirement.label}
                                     meets={requirement.re.test(password)}/>
            ))
        }
        <PasswordRequirement
            mb={"sm"}
            meets={password === passwordConfirm && !!password}
            label={"Die Passwörter stimmen überein"}
        />
    </Box>
}