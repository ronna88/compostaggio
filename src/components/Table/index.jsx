import { useContext, } from "react"
import { IlhaContext } from "../../contexts/IlhasContext";

export function Table({ header }) {
    let data = false;

    console.log(window.location.href.split("/")[3])
    const { lixeiras, ilhas, carregarIlhas, carregarLixeiras } = useContext(IlhaContext);

    if (window.location.href.split("/")[3] == "lixeira") {
        console.log("entrou case lixeira");
        carregarLixeiras();
        data = lixeiras;
    }

    if(window.location.href.split("/")[3] == "ilha") {
        console.log("entrou case ilha")
        carregarIlhas();
        data = ilhas;
    }


    return (

        <table className="table">
            <thead>
                <tr>
                    {header.map((h) => {
                        return (<th key={h}>{h}</th>)
                    })}
                </tr>
            </thead>
            <tbody>
                {data ? (

                    data.map((d) => {
                        return (
                            <tr key={d.id}>
                                <td>{d.id}</td>
                                <td>{d.nome}</td>
                                <td>{d.descricao}</td>
                                {d.ilha ? <td>{d.ilha}</td> : <></>}
                            </tr>
                        )
                    })
                ) : "Carregando dados..."}
            </tbody>

        </table>
    )
}