import React from "react"
import Firebase from "./firebase"

const createFirebase = () => {
    let firebase = null;
    if (!firebase || typeof window === "undefined") {
        firebase = new Firebase()
    }
    return firebase
}

const FirebaseContext = React.createContext<Firebase | null>(null)

const createGenericContext = <T extends unknown>() => {
    // Create a context with a generic parameter or undefined
    const genericContext = React.createContext<T | undefined>(undefined)

    // Check if the value provided to the context is defined or throw an error
    const useGenericContext = () => {
        const contextIsDefined = React.useContext(genericContext)
        if (!contextIsDefined) {
            throw new Error("useGenericContext must be used within a Provider")
        }
        return contextIsDefined
    }

    return [useGenericContext, genericContext.Provider] as const
}
export const [useFirebaseService,FirebaseProvider] = createGenericContext<Firebase>()

export const FirebaseServiceProvider = <P extends object>(Component: React.ComponentType<P>) => {
    const firebase = createFirebase()
    return function Proivder({ ...props }) {
        return (
            <FirebaseProvider value={firebase} >
                <Component {...props as P} />
            </FirebaseProvider>
        )
    }
}

export type useFirebaseType = typeof useFirebaseService

export default FirebaseContext