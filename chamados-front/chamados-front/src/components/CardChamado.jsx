// mostra um resumo de cada chamado na lista 
import { Link } from "react-router-dom";
import Etiquetas from "./Etiquetas";

function CardChamado(props) {
  const chamado = props.chamado;

  return (
    <Link to={"/chamado/" + chamado.id} className="card-chamado">
      <div className="card-topo">
        <h3>{chamado.titulo}</h3>
        <Etiquetas chamado={chamado} />
      </div>
      <p>{chamado.tipo} · {chamado.local}</p>
    </Link>
  );
}

export default CardChamado;
