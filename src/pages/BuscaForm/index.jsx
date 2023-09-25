import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IlhaContext } from "../../contexts/IlhasContext";

export function BuscaForm({ lixeiras }) {
    const [idLixeira, setIdLixeira] = useState();
    const navigate = useNavigate();
    const {carregarLixeiras} = useContext(IlhaContext);

    if(lixeiras.length === 0){
        carregarLixeiras();
    }

    const buscarLixeira = () => {
        event.preventDefault();
        console.log("buscar");
        console.log(lixeiras);
        const lixeira = lixeiras.filter(l => l.id === idLixeira);
        console.log("lixeira filtrada ");
        navigate("/peso/" + lixeira[0].id);
    }

    return (
        <div className="container mt-2 pt-2">
            <div className="card mt-2 p-4">
                <div className="card-header">
                    <h3>Busca de Lixeiras</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-2">
                            <label className="form-label">Código Lixeira</label>
                            <input type="text" className="form-control" placeholder="Código da Lixeira"
                           onChange={(e)=> setIdLixeira(e.target.value)} value={idLixeira} />
                        </div>
                        

                        <button onClick={buscarLixeira} className="btn btn-primary">Busca</button>
                    </form>
                </div>
            </div>
        </div>
        
    )
}