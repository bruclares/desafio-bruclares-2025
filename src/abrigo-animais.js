/**
 * Capitaliza uma string (primeira letra maiúscula, resto minúscula).
 */
function capitalize(palavra) {
  if (!palavra) return "";
  const primeiraLetra = palavra[0].toUpperCase();
  const restoDaPalavra = palavra.slice(1).toLowerCase();
  return primeiraLetra + restoDaPalavra;
}

/**
 * Verifica se uma pessoa possui todos os brinquedos favoritos de um animal,
 * respeitando a ordem e permitindo outros brinquedos no meio.
 * Esta função implementa as Regras 1 e 2.
 */
function temBrinquedosNaOrdem(brinquedosDoAnimal, brinquedosDaPessoa) {
  let indiceBrinquedoAnimal = 0;
  for (let i = 0; i < brinquedosDaPessoa.length; i++) {
    // Se o brinquedo atual da pessoa é o que estamos procurando na lista do animal...
    if (brinquedosDaPessoa[i] === brinquedosDoAnimal[indiceBrinquedoAnimal]) {
      // ...avançamos nosso ponteiro para o próximo brinquedo favorito.
      indiceBrinquedoAnimal++;
    }
    // Se o ponteiro alcançou o tamanho da lista de favoritos, significa que encontramos todos.
    if (indiceBrinquedoAnimal === brinquedosDoAnimal.length) {
      return true;
    }
  }
  // Se o loop terminar e não tivermos encontrado todos, a pessoa não é apta.
  return false;
}

class AbrigoAnimais {
  // Base de dados fixa com os animais disponíveis para adoção.
  animaisDisponiveis = [
    { nome: "Rex", especie: "cão", brinquedos: ["RATO", "BOLA"] },
    { nome: "Mimi", especie: "gato", brinquedos: ["BOLA", "LASER"] },
    { nome: "Fofo", especie: "gato", brinquedos: ["BOLA", "RATO", "LASER"] },
    { nome: "Zero", especie: "gato", brinquedos: ["RATO", "BOLA"] },
    { nome: "Bola", especie: "cão", brinquedos: ["CAIXA", "NOVELO"] },
    { nome: "Bebe", especie: "cão", brinquedos: ["LASER", "RATO", "BOLA"] },
    { nome: "Loco", especie: "jabuti", brinquedos: ["SKATE", "RATO"] },
  ];

  encontraPessoas(brinquedosPessoa1Str, brinquedosPessoa2Str, ordemAnimaisStr) {
    // Converte as strings de entrada em arrays, removendo espaços
    // e padronizando para maiúsculas para evitar erros de comparação.
    const listaBrinquedosPessoa1 = brinquedosPessoa1Str
      .split(",")
      .map((brinquedo) => brinquedo.trim().toUpperCase());
    const listaBrinquedosPessoa2 = brinquedosPessoa2Str
      .split(",")
      .map((brinquedo) => brinquedo.trim().toUpperCase());
    const nomesDosAnimaisParaAdocao = ordemAnimaisStr
      .split(",")
      .map((animal) => capitalize(animal.trim()));

    // Armazena o resultado final do processamento.
    const relatorioFinal = [];
    // Controladores para a Regra 5: Limite de 3 adoções por pessoa.
    let contadorAdotadosPessoa1 = 0;
    let contadorAdotadosPessoa2 = 0;

    for (const nomeDoAnimal of nomesDosAnimaisParaAdocao) {
      // Busca o objeto completo do animal na nossa base de dados.
      const animalAtual = this.animaisDisponiveis.find(
        (animal) => animal.nome === nomeDoAnimal
      );

      // Validação de entrada: Se o animal não existe, encerra com erro.
      if (!animalAtual) return { erro: "Animal inválido" };

      // Verifica se cada pessoa cumpre os pré-requisitos para o animal atual.
      // Combina a verificação de brinquedos (Regras 1 e 2) com o limite de adoção (Regra 5).
      const pessoa1PodeAdotar =
        temBrinquedosNaOrdem(animalAtual.brinquedos, listaBrinquedosPessoa1) &&
        contadorAdotadosPessoa1 < 3;
      const pessoa2PodeAdotar =
        temBrinquedosNaOrdem(animalAtual.brinquedos, listaBrinquedosPessoa2) &&
        contadorAdotadosPessoa2 < 3;

      let donoFinal;

      // Bloco de decisão principal para determinar o destino do animal.
      // Implementa a Regra 4: Em caso de empate, o animal fica no abrigo.
      if (pessoa1PodeAdotar && pessoa2PodeAdotar) {
        donoFinal = "abrigo";
      } else if (pessoa1PodeAdotar) {
        donoFinal = "pessoa 1";
        contadorAdotadosPessoa1++; // Incrementa o contador da pessoa.
      } else if (pessoa2PodeAdotar) {
        donoFinal = "pessoa 2";
        contadorAdotadosPessoa2++; // Incrementa o contador da pessoa.
      } else {
        // Se ninguém pode adotar, ele também fica no abrigo.
        donoFinal = "abrigo";
      }

      // Adiciona a string formatada ao relatório final.
      relatorioFinal.push(animalAtual.nome + " - " + donoFinal);
    }

    // Retorna o objeto no formato esperado, com a lista de resultados ordenada alfabeticamente.
    return { lista: relatorioFinal.sort() };
  }
}

const abrigo = new AbrigoAnimais();
const resultado1 = abrigo.encontraPessoas(
  "RATO,BOLA", // brinquedos da pessoa 1
  "RATO,NOVELO", // brinquedos da pessoa 2
  "Rex,Fofo" // ordem dos animais
);
console.log(resultado1);

const resultado2 = abrigo.encontraPessoas(
  "BOLA,LASER", // pessoa 1
  "BOLA,NOVELO,RATO,LASER", // pessoa 2
  "Mimi,Fofo,Rex,Bola" // ordem dos animais
);
console.log(resultado2);

export { AbrigoAnimais as AbrigoAnimais };
