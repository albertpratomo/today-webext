interface Color {
    id: string
    eventColorId?: string
    name: string
    200: string
    600: string
    650: string
    700: string
}

const calendarColors: Color[] = [
    {
        id: '1',
        name: 'cocoa',
        200: '#E9D0C5', // text
        600: '#50372C', // bg pressed
        650: '#422E26', // bg hover
        700: '#3C2921', // bg default
    },
    {
        id: '2',
        eventColorId: '4',
        name: 'flamingo',
        200: '#FFD1D7', // text
        600: '#94383E', // bg pressed
        650: '#75323F', // bg hover
        700: '#692A35', // bg default
    },
    {
        id: '3',
        eventColorId: '11',
        name: 'tomato',
        200: '#FFB2B2', // text
        600: '#7D1F1F', // bg pressed
        650: '#5E2121', // bg hover
        700: '#4F1A1A', // bg default
    },
    {
        id: '4',
        eventColorId: '6',
        name: 'tangerine',
        200: '#FFE4C9', // text
        600: '#9C4125', // bg
        650: '#6E3221', // bg hover
        700: '#5E2F22', // bg default
    },
    {
        id: '5',
        name: 'pumpkin',
        200: '#FFE8B9', // text
        600: '#964F20', // bg
        650: '#633D20', // bg hover
        700: '#59381F', // bg default
    },
    {
        id: '6',
        name: 'mango',
        200: '#FFFFB1', // text
        600: '#A36818', // bg
        650: '#805617', // bg hover
        700: '#6B4915', // bg default
    },
    {
        id: '7',
        name: 'eucalyptus',
        200: '#BEFFE2', // text
        600: '#256B49', // bg
        650: '#26523D', // bg hover
        700: '#244737', // bg default
    },
    {
        id: '8',
        eventColorId: '10',
        name: 'basil',
        200: '#D0FFDC', // text
        600: '#376643', // bg
        650: '#31523A', // bg hover
        700: '#2C4733', // bg default
    },
    {
        id: '9',
        name: 'pistachio',
        200: '#CAFFB4', // text
        600: '#31711B', // bg
        650: '#2F5424', // bg hover
        700: '#2E4F23', // bg default
    },
    {
        id: '10',
        name: 'avocado',
        200: '#FFFFB8', // text
        600: '#6D781D', // bg
        650: '#5A5E2F', // bg hover
        700: '#4F522A', // bg default
    },
    {
        id: '11',
        name: 'citron',
        200: '#FFFFBF', // text
        600: '#8C7000', // bg
        650: '#635516', // bg hover
        700: '#594C15', // bg default
    },
    {
        id: '12',
        eventColorId: '5',
        name: 'banana',
        200: '#FFFFB8', // text
        600: '#8A6C1F', // bg
        650: '#6E570B', // bg hover
        700: '#634D03', // bg default
    },
    {
        id: '13',
        eventColorId: '2',
        name: 'sage',
        200: '#BAFFF9', // text
        600: '#1E665A', // bg
        650: '#1E5953', // bg hover
        700: '#1C524C', // bg default
    },
    {
        id: '14',
        eventColorId: '7',
        name: 'peacock',
        200: '#C8F8FF', // text
        600: '#2F5FA8', // bg
        650: '#193F6B', // bg hover
        700: '#183D61', // bg default
    },
    {
        id: '15',
        name: 'cobalt',
        200: '#C9E7FF', // text
        600: '#2A46A8', // bg
        650: '#29398A', // bg hover
        700: '#222F73', // bg default
    },
    {
        id: '16',
        eventColorId: '9',
        name: 'blueberry',
        200: '#D7D0FF', // text
        600: '#3E3799', // bg active
        650: '#352F70', // bg hover
        700: '#322D64', // bg default
    },
    {
        id: '17',
        eventColorId: '1',
        name: 'lavender',
        200: '#E8D8FF', // text
        600: '#4F3F9E', // bg
        650: '#433778', // bg hover
        700: '#3A3066', // bg default
    },
    {
        id: '18',
        name: 'wisteria',
        200: '#FBE3FF', // text
        600: '#836BB7', // bg
        650: '#4A387A', // bg hover
        700: '#403266', // bg default
    },
    {
        id: '19',
        eventColorId: '8',
        name: 'graphite',
        200: '#E1E2E2', // text
        600: '#5B5B5B', // bg
        650: '#353536', // bg hover
        700: '#2E2E2E', // bg default
    },
    {
        id: '20',
        name: 'birch',
        200: '#FFFFF8', // text
        600: '#806B50', // bg
        650: '#614E38', // bg hover
        700: '#544532', // bg default
    },
    {
        id: '21',
        name: 'radicchio',
        200: '#FFD3FF', // text
        600: '#AB3A67', // bg
        650: '#6B1F3B', // bg hover
        700: '#611E39', // bg default
    },
    {
        id: '22',
        name: 'cherry',
        200: '#FFDAFC', // text
        600: '#AE4163', // bg
        650: '#73253F', // bg hover
        700: '#6B243C', // bg default
    },
    {
        id: '23',
        eventColorId: '3',
        name: 'grape',
        200: '#F3C7FF', // text
        600: '#5A2E8F', // bg
        650: '#3E2069', // bg hover
        700: '#3D2061', // bg default
    },
    {
        id: '24',
        name: 'amethyst',
        200: '#FFE8FF', // text
        600: '#7C4F90', // bg
        650: '#4D2E5C', // bg hover
        700: '#452A52', // bg default
    },
];

const eventColors: Color[] = calendarColors
    .filter(c => c.eventColorId)
    .map(c => ({
        ...c,
        id: c.eventColorId,
    }));

const defaultEventColor = eventColors.find(c => c.name === 'blueberry')!;

export function getEventColor(id?: string): Color {
    if (!id)
        return defaultEventColor;

    return eventColors.find(c => c.id === id) || defaultEventColor;
}
