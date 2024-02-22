$(document).ready(async function () {
    HomeTab();
});

function getData(url: string) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'GET',
            url: url,
            success: (list) => resolve(list),
            error: e => reject(e),
        });
    });
};

async function InitData() {
    showSpinner()
    let list = await getData(`https://api.coingecko.com/api/v3/coins/list`) as any;
    list = list.slice(0, 100);
    localStorage.setItem('list', JSON.stringify(list));
    setData(list, "cards");
};

function setData(list: any, idElement: string) {
    $(`#${idElement}`).html("");
    for (let item of list) {
        const cardDivString =
            `<div class="card col-lg-4 col-md-4 col-sm-12">
                <div class="card-body">
                    <label class="switch" for="toggle_${item.id}">
                        <input type="checkbox" id="toggle_${item.id}" onclick="addCard('${item.id}',this.checked)">
                        <span class="slider round"></span>
                    </label>
                    <h4 class="card-title">${item.symbol.toUpperCase()}</h4>
                    <span class="card-text">${item.name}</span>
                    <button id="moreInfo" class="btn btn-primary" onclick="getMoreInfo('${item.id}')" data-toggle="collapse"
                        data-target="#info_${item.id}">more info</button>
                    <div id="info_${item.id}" class="collapse multi-collapse"></div>
                </div>
            </div>`
        $(`#${idElement}`).append(cardDivString);
    };
    hideSpinner();
};

async function getMoreInfo(id: any) {
    showSpinner();
    //אם דיב לא מכיל ילדים (עוד נתונים)
    if (document.getElementById(`info_${id}`).childElementCount == 0) {

        // get data from localStorage by id
        let infoFromStorage = JSON.parse(localStorage.getItem(`${id}_moreInfo`)); //as person

        // if not in localStorage go to url to get data
        if (infoFromStorage == undefined) {
            //get date
            infoFromStorage = await this.getData(`https://api.coingecko.com/api/v3/coins/${id}`);
            //set in localStorage
            localStorage.setItem(`${id}_moreInfo`, JSON.stringify(infoFromStorage));
        }
        //set in element
        let img_elem = document.createElement("img");
        img_elem.setAttribute("src", `${infoFromStorage.image.small}`);
        let text_elem = document.createElement("span");
        text_elem.className = "textElem";
        text_elem.textContent = `${infoFromStorage.market_data.current_price.usd}$  |  ${infoFromStorage.market_data.current_price.eur}€  |  ${infoFromStorage.market_data.current_price.ils}₪`;
        document.getElementById(`info_${id}`).appendChild(img_elem);
        document.getElementById(`info_${id}`).appendChild(text_elem);
    }
    hideSpinner();
};

$("#search").on("input", async function () {
    filterList($(this).val());
})

$("#btnSearch").on("click", async function (event) {
    console.log(event);
    filterList($("#search").val());
})

function filterList(search: any) {
    debugger
    let list = JSON.parse(localStorage.getItem('list'));

    list = list?.filter((item: any) => item.name.toLowerCase().indexOf(search.toLowerCase()) > -1);
    setData(list, "cards");
}

function HomeTab() {
    InitData()
    const html = $("#home").html();
    $("#body").html(html);
}

$("#btnHome").on("click", function () {
    HomeTab();
});

$("#btnActiveReports").on("click", function () {
    const html = $("#activeReports").html();
    $("#body").html(html);
});

$("#btnAbout").on("click", function () {
    const html = $("#about").html();
    $("#body").html(html);
    timeNow();
});

function showSpinner() {
    $('body').addClass('busy');
};

function hideSpinner() {
    $('body').removeClass('busy');
}

setTimeout(function () { localStorage.removeItem('list'); }, 120 * 1000);
let list = JSON.parse(localStorage.getItem('list'));

//  POP UP
let cards: any[] = [];
let lastID = "";

function addCard(cardId: any, checked: any) {
    if (checked) {
        if (cards.length >= 5) {
            let listF: any[] = [];
            list = JSON.parse(localStorage.getItem('list'));

            cards.forEach(x => {
                listF.push(list.filter((item: any) => item.id == x))
            });

            let a = [];
            for (let index = 0; index < listF.length; index++) {
                a.push(listF[index][0]);
            }

            lastID = cardId;
            setData(a, "modalBody");
            let element = document.getElementById("btnModal") as HTMLElement;
            element.click();

            $("#myModal").find('input[type="checkbox"]').prop('checked', true);
            $("#myModal").find('#moreInfo').hide();
        }
        else {
            cards.push(cardId);
        }
    }
    else {
        cards.splice(cards.indexOf(cardId), 1);
        $("[data-dismiss=modal]").trigger("click");

    }
    if (lastID != "") {
        cards.push(cardId);
        lastID = "";
    };

    localStorage.setItem('cardsToReports', JSON.stringify(cards));
};


//   איחול לעמוד לאודות
function timeNow() {
    let now = new Date();
    let time: number = now.getHours();
    if (time < 5)
        $("#bestWishes").text(" לילה טוב :) ");
    else if (time < 12)
        $("#bestWishes").text(" בוקר טוב :) ");
    else if (time < 19)
        $("#bestWishes").text(" צהריים טובים :) ");
    else
        $("#bestWishes").text(" ערב טוב :) ");
};