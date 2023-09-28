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
        const agora = new Date();
        const expireIlhas = new Date(agora.getTime() + 60 * 60 * 1000); 

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
            localStorage.setItem(
                'ilhas', 
                JSON.stringify(ilhasSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })))
            );
            localStorage.setItem('expireIlhas', expireIlhas);
        };
        if(!localStorage.getItem('ilhas') || !localStorage.getItem('expireIlhas')) {
            fetchIlhas();
        }
        if(localStorage.getItem('expireIlhas' < agora)){
            console.log("Fora do prazo de cache...");
            fetchIlhas();
        }
    }





    const carregarLixeiras = () => {
        console.log("carregarLixeiras...");
        const agora = new Date();
        const expireLixeiras = new Date(agora.getTime() + 60 * 60 * 1000); 

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
            localStorage.setItem(
                'lixeiras', 
                JSON.stringify(lixeirasSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })))
            );
            localStorage.setItem('expireLixeiras', expireLixeiras);
        };
        if(!localStorage.getItem('lixeiras') || !localStorage.getItem('expireLixeiras')) {
            fetchLixeiras();
        }
        if(localStorage.getItem('expireLixeiras' < agora)){
            console.log("Fora do prazo de cache...");
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