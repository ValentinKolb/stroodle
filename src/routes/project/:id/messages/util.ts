import {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {MessageModel} from "../../../../lib/models.ts";


/**
 * This hook scrolls to the element with the id in the url
 * The element must have a data-id attribute
 * @param notFoundCallback this function is called if the element is not found. the function should return true if the element should be searched for again
 */
export const useScrollToElement = (notFoundCallback: (id: string) => Promise<boolean>) => {
    const [searchParams] = useSearchParams()
    // this useEffect scrolls to the message with the id in the url
    useEffect(() => {
        (async () => {
            const scrollToId = searchParams.get("scrollToId")
            if (scrollToId) {
                let element: Element | null = null

                // this loop searches for the element with the id in the url
                while (!element) {

                    // search for the element
                    element = document.querySelector(`[data-id="${scrollToId}"]`)

                    // if the element is found, break out of the loop
                    if (element) break

                    // if the element is not found, call the notFoundCallback
                    // if the callback returns false, return from the hook
                    if (!await notFoundCallback(scrollToId)) return
                }

                // scroll to the element
                element.scrollIntoView({behavior: "smooth"})
            }
        })()
    }, [searchParams]);
}


// return a link to a message that will scroll to it when clicked
export const scrollToMessage = (elem: MessageModel) => (
    `/project/${elem.project}/messages?scrollToId=${elem.id}`
)
