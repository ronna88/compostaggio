import { useState } from "react";
import { app } from "../../services/firebase";
import { addDoc, collection, getFirestore } from "firebase/firestore";

export function IlhasForm() {

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const firestore = getFirestore(app);

    const cadastrarIlha = () => {
        event.preventDefault();

        const novaIlha = {
            nome,
            descricao
        }
        console.log(novaIlha);
        addDoc(collection(firestore, "ilhas"), novaIlha)
            .then((docRef) => {
                console.log(docRef.id);
            });
        
        limpaEstados();
    }

    const limpaEstados = () => {
        setNome('');
        setDescricao('');
    }

    return (
        <div className="container mt-2 pt-2">
            <div className="card mt-2 p-4">
                <div className="card-header">
                    <h3>Cadastro de Ilhas</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-2">
                            <label className="form-label">Nome da Ilha</label>
                            <input type="text" className="form-control" placeholder="Nome da Ilha"
                            onChange={(e) => { setNome(e.target.value)}} value={nome} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descrição da Ilha</label>
                            <input type="text" className="form-control" placeholder="Descrição da Ilha"
                            onChange={(e)=> setDescricao(e.target.value)} value={descricao} />
                        </div>

                        <button onClick={cadastrarIlha} className="btn btn-primary">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
        
    )
}