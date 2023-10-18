import {useState} from 'react'
import {Avatar, CheckIcon, Combobox, Group, Pill, PillsInput, Text, useCombobox} from '@mantine/core'
import {useMutation} from "@tanstack/react-query";
import {usePB} from "../../lib/pocketbase.tsx";
import {UserViewModel} from "../../lib/models.ts";
import {IconMoodSad, IconUsersGroup} from "@tabler/icons-react";


export default function UserSearch({label, description, selectedUsers, setSelectedUsers}: {
    label?: string
    description?: string
    selectedUsers: UserViewModel[]
    setSelectedUsers: (users: UserViewModel[]) => void
}) {

    const {pb, user} = usePB()

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    })

    const [search, setSearch] = useState('')

    const selectedUserIds = selectedUsers.map((user) => user.id)

    const searchUserMutation = useMutation({
        mutationFn: async (search: string) => {
            return (await pb.collection('usernames').getList<UserViewModel>(1, 10, {
                filter: `username ~ "${search.replace(/^@/,'')}%"`,
            })).items.filter((u) => u.id !== user?.id)
        }
    })

    const handleValueSelect = (val: string) => {
        if (selectedUserIds.includes(val)) {
            return handleValueRemove(val)
        }
        setSelectedUsers(
            [
                ...selectedUsers,
                searchUserMutation.data?.find((user) => user.id === val)
            ].filter(user => user !== undefined) as UserViewModel[]
        )
        setSearch('')
    }

    const handleValueRemove = (val: string) => {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== val))
    }

    const values = selectedUsers.map((selectedUser) => (
        <Pill
            key={selectedUser.id}
            withRemoveButton={user?.id !== selectedUser.id}
            onRemove={() => handleValueRemove(selectedUser.id)}
        >
            @{selectedUser.username}
        </Pill>
    ))

    const options = (searchUserMutation.data || [])
        .map((userView) => (
            <Combobox.Option value={userView.id} key={userView.id} active={selectedUserIds.includes(userView.id)}>
                <Group gap="sm">
                    {selectedUserIds.includes(userView.id) ? <CheckIcon size={12}/> : null}
                    <Avatar
                        src={userView.avatar ? pb.files.getUrl(userView, userView.avatar) : null}
                        alt="Profile Pic"
                        size="xs"
                    >
                        {userView.username.slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Text span c={"dimmed"} size="sm">@{userView.username}</Text>
                </Group>
            </Combobox.Option>
        ))

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
            <Combobox.DropdownTarget>
                <PillsInput
                    label={label}
                    description={description}
                    onClick={() => combobox.openDropdown()}
                    leftSection={<IconUsersGroup size={18}/>}
                >
                    <Pill.Group>
                        {values}

                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={search}
                                placeholder="Suche nach Personen"
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex()
                                    setSearch(event.currentTarget.value)
                                    searchUserMutation.mutate(event.currentTarget.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0) {
                                        event.preventDefault();
                                        handleValueRemove(selectedUsers[selectedUsers.length - 1].id)
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length > 0 ? options : <Combobox.Empty>
                        {searchUserMutation.isPending ? 'Lade...' : <Group>

                            <IconMoodSad size={18}/>

                            <Text span c={"dimmed"} size="sm">Keine Ergebnisse</Text>

                        </Group>}
                    </Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}