import { useState } from "react";
import { app } from "../../services/firebase";
import { addDoc, collection, getFirestore } from "firebase/firestore";

export function LixeirasForm({ ilhas }) {

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [ilha, setIlha] = useState('');

    const firestore = getFirestore(app);

    const cadastrarLixeira = () => {
        event.preventDefault();

        const novaLixeira = {
            nome,
            descricao,
            ilha
        }
        console.log(novaLixeira);
        addDoc(collection(firestore, "lixeiras"), novaLixeira)
            .then((docRef) => {
                console.log(docRef.id);
            });
        
        limpaEstados();
    }

    const limpaEstados = () => {
        setNome('');
        setDescricao('');
        setIlha('');
    }

    return (
        <div className="container mt-2 pt-2">
            <div className="card mt-2 p-4">
                <div className="card-header">
                    <h3>Cadastro de Lixeiras</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-2">
                            <label className="form-label">Nome da Lixeira</label>
                            <input type="text" className="form-control" placeholder="Nome da Lixeira"
                            onChange={(e) => { setNome(e.target.value)}} value={nome} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Descrição da Lixeira</label>
                            <input type="text" className="form-control" placeholder="Descrição da Lixeira"
                            onChange={(e)=> setDescricao(e.target.value)} value={descricao} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ilha</label>
                            <select className="form-select" onChange={(e)=> setIlha(e.target.value)}>
                                <option selected>Selecione a Ilha</option>
                                {ilhas.map((i)=> {
                                    return (
                                        <option value={i.id}>{i.nome}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <button onClick={cadastrarLixeira} className="btn btn-primary">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
        
    )
}