import { createContext, useState } from "react";
import {app} from '../services/firebase';
import { addDoc, collection, getFirestore, getDocs } from "firebase/firestore";

const IlhaContext = createContext({});
const firestore = getFirestore(app);

const IlhaProvider = ({children}) => {
    const [ilhas, setIlhas] = useState([]);
    const [lixeiras, setLixeiras] = useState([]);

    const carregarIlhas = () => {
        console.log("carregarIlhas...");
        const fetchIlhas = async () => {
            console.log("iniciando consulta de ilhas");
            const ilhasCollection = collection(firestore, "ilhas");
            const ilhasSnapshot = await getDocs(ilhasCollection);

            setIlhas(
                ilhasSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        };
        if(ilhas.length === 0) {
            fetchIlhas();
        }
    }

    const carregarLixeiras = () => {
        console.log("carregarLixeiras...");

        const fetchLixeiras = async () => {
            console.log("iniciando consulta de lixeiras");
            const lixeirasCollection = collection(firestore, "lixeiras");
            const lixeirasSnapshot = await getDocs(lixeirasCollection);

            setLixeiras(
                lixeirasSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        };

        if(lixeiras.length === 0) {
            console.log("oi")
            fetchLixeiras();
        }
    }

    const ilhaContextData = {
        carregarIlhas,
        carregarLixeiras,
        ilhas,
        lixeiras,
        setIlhas
    }

    return (
        <IlhaContext.Provider value={ilhaContextData}>
            {children}
        </IlhaContext.Provider>
    )
}

export { IlhaContext, IlhaProvider }