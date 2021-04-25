const fs = require('fs');
const pdf = require('pdf-parse');


const pdfAObjt = (numeroE) => new Promise(async (resolve, reject) => {
    const nombPdf = []
    const arrData = []

    for (let i = 0; i < numeroE; i++) {
        const name = `/tmp/${i}.pdf`
        // const name = `/tmp/2.pdf`
        nombPdf.push(name)
    }

    console.log(nombPdf)

    let contador = 0

    const contadorFun = () => {
        if (contador < numeroE) {
            resolveAfter(nombPdf[contador])
        } else {
            console.log('Tarea terminada totalmente')
            resolve(arrData)
        }
    }

    async function resolveAfter(url) {

        let dataBuffer = fs.readFileSync(url);

        await pdf(dataBuffer).then(function (data) {
            let arrText = []
            const arrParse = data.text.split(/\n \n{1,}/)
            arrParse.forEach((element, i) => {
                element = element.replace(/\n/g, ' ')
                if (!(/fci|FCI/g).test(arrParse[i])) {
                    if (!((/^TRADUCCI|^Traducci/)).test(element)) {
                        arrText.push(element)
                    }
                }
            });
            let arrText2 = [];
            arrText.forEach((element, i) => {
                if (!(/^FEDERATION/).test(arrText[i])) {
                    arrText2.push(element)
                }
            });
            let arrText3 = [];

            arrText2.forEach((element, i) => {
                if ((/^[0-9]/).test(element)) {
                    element = element.replace(/^[0-9]/, '')
                }
                element = element.replace(/ {1,}/g, ' ')
                element = element.replace(/^ |^  /, '')
                arrText3.push(element)
                // if (!(/^[0-9]/).test(element)) {
                //     element = element.replace(/ {1,}$/, '')
                //     arrText3.push(element)
                // }
            });

            let arrText4 = []
            arrText3.forEach((e => {
                if (!(/^[0-9]/).test(e) && e.length > 2) {
                    arrText4.push(e)
                }
            }))

            let dataObj = {raza: [], tamano:[]}

            if ((/[()]/).test(arrText4[0])) {
                let arr1 = arrText4[0].replace(')', '')
                let arr = arr1.split('(')
                dataObj.raza = arr
            } else {
                dataObj.raza = [arrText4[0]]
            }
            const regxTamano = (/^TAMA|^Tama/)
            const regx = [
                (/^ORIGEN|^Origen/),
                (/^FECHA|^Fecha/),
                (/^UTILIZACI|^Utilizaci/),
                (/^BREVE|^Breve/),
                (/^APARIENCIA|^Apariencia/),
                (/^COMPORTAMIENTO|^Comportamiento/),
                (/^CABEZA|^Cabeza/),
                (/^REGION CRANEAL|^Region craneal/),
                (/^REGION FACIAL|^Region facial/),
                (/^OJOS|^Ojos/),
                (/^OREJAS|^Orejas/),
                (/^CUELLO|^Cuello/),
                (/^CUERPO|^Cuerpo/),
                (/^MIEMBROS ANTERIORES|^Miembros anteriores/),
                (/^MIEMBROS POSTERIORES|^Miembros posteriores/),
                (/^MOVIMIENTO|^Movimiento/),
                (/^PIEL|^Piel/),
                (/^PELO|^Pelo/),
                (/^COLOR|^Color/),
                (/^FALTAS|^Faltas/),
                (/^FALTAS GRAVES|^Faltas graves/),
                (/^FALTAS DESCALIFICANTES|^Faltas descalificantes/),
            ]
            const nom = [
                'origen',
                'fecha',
                'utilizado',
                'historia',
                'apariencia',
                'comportamiento',
                'cabeza',
                'craneal',
                'facial',
                'ojos',
                'orejas',
                'cuello',
                'cuerpo',
                'eanteriores',
                'eposteriores',
                'movimiento',
                'piel',
                'pelo',
                'color',
                'faltas',
                'graves',
                'descalificantes',
            ]
            arrText4.forEach((element, i) => {
                element = element.replace(/(.)$/, '')
                regx.forEach((eRg, ind) => {
                    // Tamaño y Peso 
                    if (ind === 0 && (regxTamano).test(element)) {
                        let ele = element.split('ltura a la cruz')
                        if (ele.length > 1) {
                            ele = ele[1].replace(/^: /, '')
                        } else {
                            ele = ele[0].replace(/^: /, '')
                            if (ele.length === 2) {
                                ele = ele[1]
                            }
                        }
                        dataObj.tamano.push(ele)
                    } else {
                        if (ind === 0 && (/^Altura a la/).test(element)) {
                            dataObj.tamano.push(element)
                        }
                        if (ind === 0 && (/^Peso/).test(element)) {
                            dataObj.tamano.push(element)
                        }
                        if ((eRg).test(element)) {
                            if ((/: /g).test(element)) {
                                let arr = element.split(/: /)
                                if (arr.length <= 2) {
                                    dataObj[nom[ind]] = arr[1]
                                } else {
                                    let nvArr = []
                                    arr.forEach((e, i) => {
                                        if (!(eRg).test(e)) {
                                            nvArr.push(e)
                                        }
                                    })
                                    dataObj[nom[ind]] = nvArr
                                }
                            } else {
                                dataObj[nom[ind]] = element // optimizar
                            }
                        }
                    }
                });
            });
            arrData.push(dataObj)
            console.log('Objeto creado. Pdfs procesados: ' + (contador + 1))
            contador++
        });
        contadorFun()
    }
    contadorFun()
}
)

// //Prueba
// pdfAObjt(10)
//     .then(d => {
//         // d.forEach(element => {
//         //     console.log(element.raza)
//         // });
//         console.log(d)
//     })

module.exports = (num) => pdfAObjt(num)