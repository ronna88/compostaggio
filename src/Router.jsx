import { Route, Routes } from "react-router-dom";
import { IlhasForm } from "./pages/IlhasForm";
import { Home } from "./components/Home";
import { Listagem } from "./pages/Listagem";
import { Table } from "./components/Table";
import { LixeirasForm } from "./pages/LixeirasForm";
import { useState, useEffect, useContext } from "react";
import { IlhaContext } from "./contexts/IlhasContext";
import { BuscaForm } from "./pages/BuscaForm";
import { PesoForm } from "./pages/PesoForm";
import { ListaIlhas } from "./components/ListaIlhas";

export function Router() {

    //const [listaIlhas, setListaIlhas] = useState([]);
    const {carregarIlhas, carregarLixeiras, ilhas, lixeiras} = useContext(IlhaContext);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const headerLixeiras = [
        "id",
        "nome",
        "descricao",
        "ilha"
    ]
    const headerIlhas = [
        "id",
        "nome",
        "descricao"
    ]

    useEffect(() => {
        if(ilhas.length === 0) {
            carregarIlhas()
        }
        if(lixeiras.length === 0) {
           carregarLixeiras()
        }
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-ilha" element={ <IlhasForm /> } />
            <Route path="/ilha"  element={ <ListaIlhas /> } />
            <Route path="/ilha/:idIlha" element={ <IlhasForm /> } />
            <Route path="/cadastro-lixeira" element={ <LixeirasForm ilhas={ilhas} /> } />
            <Route path="/lixeira"  element={ <Listagem componente={<Table data={lixeiras} header={headerLixeiras}/>} /> } />
            <Route path="/busca" element={ <BuscaForm lixeiras={lixeiras} /> }/>
            <Route path="/peso/:idLixeira" element={<PesoForm />}  />
        </Routes>
    )
}