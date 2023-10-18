export const scrollToMessage = (id: string) => {
    const message = document.querySelector(`[data-id="${id}"]`)
    if (message) {
        message.scrollIntoView({behavior: "smooth"})
    }
}