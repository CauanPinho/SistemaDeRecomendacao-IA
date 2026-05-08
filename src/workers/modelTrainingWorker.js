import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
import { workerEvents } from '../events/constants.js';

console.log('Model training worker initialized');
let _globalCtx = {};
//abre a function aqui
function makeContext(catalog,users){


    const ages = users.map(u =>u.age);
    const prices = catalog.map(p=>p.price);


    //abre as variáveis p receber os valores de min e max pra poder normalizar os dados
    const minAge=Math.min(...ages);
    const maxAge=Math.max(...ages);


    const minValue=Math.min(...prices);
    const maxValue=Math.max(...prices)

    const colors = [...new Set(catalog.map(p => p.color))];
    const catagories = [...new Set(catalog.map(p => p.category))];

 const colorIndex = Object.fromEntries(
  colors.map((color, index) => {
    return [color, index];
  })
);
const categoryIndex = Object.fromEntries(
  catagories.map((category, index) => {
    return [category, index];
  })
);



//computar a media de idade de compradores por produto, ajuda a personalizar

const midAge = minAge + maxAge / 2;
const ageSums = {};
const ageCounts = {};
users.forEach(user => {
    user.purchases.forEach(p=> {
        ageSums(p.name) = (ageSums(p.name)||0) + user.age;
        ageCounts(p.name) = (ageCounts(p.name)||0) + 1;
    }               
    )
})
debugger
}

const categoriesIndex = Object.fromEntries(
  categories.map((category, index) => {
    return [category, index];
  })
);

async function trainModel({ users }) {
    console.log('Training model with users:', users)

    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 50 } });
    const catalog = await (await fetch ( 'data/products.json')).json();

    const context = makeContext(catalog, users); 
    debugger
    postMessage({
        type: workerEvents.trainingLog,
        epoch: 1,
        loss: 1,
        accuracy: 1
    });

    setTimeout(() => {
        postMessage({ type: workerEvents.progressUpdate, progress: { progress: 100 } });
        postMessage({ type: workerEvents.trainingComplete });
    }, 1000);


}
function recommend(user, ctx) {
    console.log('will recommend for user:', user)
    // postMessage({
    //     type: workerEvents.recommend,
    //     user,
    //     recommendations: []
    // });
}


const handlers = {
    [workerEvents.trainModel]: trainModel,
    [workerEvents.recommend]: d => recommend(d.user, _globalCtx),
}

self.onmessage = e => {
    const { action, ...data } = e.data;
    if (handlers[action]) handlers[action](data);
}
