import { useContext, useEffect, useState } from "react"
import { IlhaContext } from "../../contexts/IlhasContext";
import { useNavigate } from "react-router-dom";
import { deleteDoc, getFirestore, doc } from "firebase/firestore";
import { app } from "../../services/firebase";

export function ListaIlhas() {

    const firestore = getFirestore(app);
    const {carregarIlhas} = useContext(IlhaContext);
    const [ilhas, setIlhas] = useState([]);

    const navigate = useNavigate();

    useEffect(()=>{
        console.log(ilhas);
        if(!localStorage.getItem('ilhas')) {
            carregarIlhas();
        }

        if(ilhas.length == 0){
            setIlhas(JSON.parse(localStorage.getItem('ilhas')));
        }
    },[ilhas])

    const deleteIlha = async (ilhaId) => {
        const ilhaRef = doc(firestore, "ilhas", ilhaId);
        try {
            await deleteDoc(ilhaRef);
            console.log("Ilha Excluida");
            setIlhas((prevList) => prevList.filter((ilha) => ilha.id !== ilhaId))
        }catch {
            console.log();
        }
    }



    return (

        <div>
            <div className="card">
                <div className="card-header">
                    Listagem
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th><th>Nome</th><th>Descrição</th><th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ilhas ? (
                                ilhas.map((ilha) => {
                                    return (
                                        <tr key={ilha.id}>
                                            <td>{ilha.id}</td>
                                            <td>{ilha.nome}</td>
                                            <td>{ilha.descricao}</td>
                                            <td><button onClick={(e) => {localStorage.setItem('editIlha', JSON.stringify(ilha)); navigate(`/ilha/${ilha.id}`)}}>Editar</button>
                                            <button onClick={(e) => {deleteIlha(ilha.id)}}>Excluir</button></td>
                                        </tr>
                                    )
                                })
                            ) : (<tr><td colSpan={4}>Carregando dados....</td></tr>)}
                            <tr><td></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}