// Function to update the view

export { updateView }

import { State } from "./types"
/**
 * Update the SVG game view.  
 * 
 * @param onFinish a callback function to be applied when the game ends.  For example, to clean up subscriptions.
 * @param s the current game model State
 * @returns void
 */
function updateView(onFinish: () => void) {
    return function (s: State):void {
        const
            svg = document.getElementById("svgCanvas"),
            ship = document.getElementById("ship")

        // if getElement is null, exit function early without doing anything
        if (!svg || !ship) return

        // document.getElementById can return null
        // so use optional chaining to safely access method on element
        const show = (id: string, condition: boolean) => ((e: HTMLElement | null) =>
            condition ? e?.classList.remove('hidden')
                : e?.classList.add('hidden'))(document.getElementById(id))

        if (s.gameEnd) {
            
        }
    }
}
