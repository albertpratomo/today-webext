declare const __DEV__: boolean
/** Extension name, defined in packageJson.name */
declare const __NAME__: string

declare module '*.vue' {
  const component: any
  export default component
}

// TODO: Use the official TS interface when it's published.
declare var documentPictureInPicture: DocumentPictureInPicture;
