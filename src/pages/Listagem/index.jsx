
export function Listagem({componente}) {


    return (
        <div className="container mt-2 pt-2">
            <div className="card p-4">
                <div className="card-header">
                    <h3>Listagem</h3>
                </div>
                <div className="card-body">
                    <div>
                        {componente}
                    </div>
                </div>
            </div>
        </div>
    )
}