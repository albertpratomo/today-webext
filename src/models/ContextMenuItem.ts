interface ContextMenuItem {
    action?: () => void
    active?: boolean
    divider?: boolean
    icon?: string
    text: string
    selected?: boolean
    submenu?: {
        text: string
        items: ContextMenuItem[]
    }
}

export default ContextMenuItem;
