
        const firebaseConfig = {
          apiKey: "AIzaSyBYI9w6SvjKunO8FpN9brxqiK0D1wbKQyY",
          authDomain: "poker-game-95fbb.firebaseapp.com",
          projectId: "poker-game-95fbb",
          storageBucket: "poker-game-95fbb.appspot.com",
          messagingSenderId: "387535463262",
          appId: "1:387535463262:web:69c330e0f1c2d397e8a5cf",
          measurementId: "G-N4G86VGF0E"
        };
      
        // Initialize Firebase
        const app = firebase.initializeApp(firebaseConfig);
        // const analytics = getAnalytics(app);

        const db = firebase.firestore(app);

        var joinedGame = 0

        function setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        var over = 0
        var antiSpam = new Date().getTime()
        var antiSpam2 = new Date().getTime()

        function dontSpam() {
            let curTime = new Date().getTime()
            if(curTime - antiSpam2 <= 3000) {
                alert("Please don't spam")
                return
            }
            antiSpam2 = curTime
        }

        var username = ""
        username = getCookie("username");
        if(username == "") {
            while(true) {
                username = prompt("Please enter your name:", "");
                if(username.length > 9) {
                    alert("Name to long, please enter again")
                } else break
            }
            if (username != "" && username != null) {
            setCookie("username", username, 365);
            }
        }

        var yourTurn = 0

        var roomId = ""
        roomId = getCookie("roomId")
        if(roomId == "") {
            roomId = uuidv4()
            setCookie("roomId", roomId, 365)
        }

        // var realStart = 0
        var unreadMess = 0

        firebase.database().ref("messages/" + roomId).on("child_added", (snapshot) => {
            const data = snapshot.val()
            unreadMess++
            $('.badge').html(unreadMess)
            // $('.chat-container2').animate({scrollTop: $('.chat-container2').prop('scrollHeight')});
            // console.log($(".chat-container2").())
            $(".chat-container2").append(`
            <div class="eachchat-container">
                <div class="message-container other-message">
                    <div class="name-container">
                        <h5>${data.sender}</h5>
                    </div>
                    <div class="message-content">
                    ${data.content}    
                    </div>
                </div>
            </div>
            `)
            $('.chat-container2').scrollTop($('.chat-container2').prop('scrollHeight'))
        })

        function sendMessage() {
            let curTime = new Date().getTime()
            if(curTime - antiSpam <= 1000) {
                alert("Please dont spam")
                return
            }
            antiSpam = curTime
            let message = $('#cc').val()
            $('#cc').val("")
            $('.chat-container2').animate({scrollTop: $('.chat-container2').prop('scrollHeight')});
            // let username = prompt("What 's your name?")
            firebase.database().ref("messages/" + roomId).push().set({
                "sender": username,
                "content": message
            })
        }

        function enterRoom() {
            if(joinedGame == 1) {
                alert("Cannot leave now")
                return
            }
            let newRoomId = $("#roomId").val()
            roomId = newRoomId
            setCookie("roomId", roomId, 365)
            location.reload()
        }

        $(document).ready(function() {
            $('.header').html("Your room id is " + roomId)
            $('#cc').keydown(function(e) {
                if(e.keyCode == 13) {
                    sendMessage()
                }
            })
            $('.chat-container2').scrollTop($('.chat-container2').prop('scrollHeight'))
            $('.message-open').click(() => {
                $('.chat-container').toggle()
                unreadMess = 0
                $('.badge').html(0)
            })
        })

          let userId = getCookie("userid")
          if(userId == "") {
              userId = username + "-" + uuidv4()
              setCookie("userid", userId, 365)
          }
        //   console.log(userId)

        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        async function shuffleCard() {
            let card = [];
            for(let i = 2; i <= 14; i++) {
                card.push(i + "-ro")
                card.push(i + "-co")
                card.push(i + "-bich")
                card.push(i + "-chuon")
            }
            shuffleArray(card)

            let arr = card.map((c, id) => {
                return firebase.database().ref("allrooms/" + roomId + "/cards/" + id).set(c)
            })
            await Promise.all(arr)
        }

        setTimeout(1500, addMemToRoom())

        async function addMemToRoom() {
            let kt = 0
            await firebase.database().ref("allrooms/" + roomId + "/members2/" + userId).once("value", (snapshot) => {
                if(snapshot.exists()) kt = 1
            })
            if(kt == 0) {
                await firebase.database().ref("allrooms/" + roomId + "/members2/" + userId).set({
                    "money": 500
                })
            }
        }

        async function getThutuInRoom(uId) {
            let id = -1
            await firebase.database().ref("allrooms/" + roomId + "/members").once("value", (snapshot) => {
                let t = Object.keys(snapshot.val())
                id = t.indexOf(uId)
            })
            return id
        }

        async function getUserId(id) {
            // console.log("Get user id")
            let ans = ""
            await firebase.database().ref("allrooms/" + roomId + "/members").once("value", (snapshot) => {
                if(!snapshot.exists()) return
                let t = Object.keys(snapshot.val())
                ans = t[id]
            })
            return ans
        }

        async function getNumberOfPlayers() {
            let ans = 0
            await firebase.database().ref("allrooms/" + roomId + "/members").once("value", (snapshot) => {
                let t = Object.keys(snapshot.val())
                ans = t.length
            })
            return ans
        }

        async function getYourCard() {
            let ans = []
            let id = await getThutuInRoom(userId)
            await firebase.database().ref("allrooms/" + roomId + "/cards").once("value", async (snapshot) => {
                let card = snapshot.val()
                // console.log(card)
                ans.push(card[52 - (id + 1) * 2])
                ans.push(card[52 - (id + 1) * 2 + 1])    
                // console.log(id)
            })
            // console.log("Your card is ", ans)
            return ans
        }

        async function getSomeOneCard(id) {
            let ans = []
            await firebase.database().ref("allrooms/" + roomId + "/cards").once("value", async (snapshot) => {
                let card = snapshot.val()
                ans.push(card[52 - (id + 1) * 2])
                ans.push(card[52 - (id + 1) * 2 + 1])    
                // console.log(id)
            })
            return ans
        }

        async function getCard(id) {
            let ans = ""
            await firebase.database().ref("allrooms/" + roomId + "/cards").once("value", (snapshot) => {
                let card = snapshot.val()
                ans = card[id]
                // console.log(id)
            })
            return ans
        }

        async function getFullCards() {
            let ans = []
            for(let i = 0; i < 5; i++) {
                let c = await getCard(i)
                ans.push(c)
            }
            return ans
        }

        async function getPot() {
            let pot = 0
            await firebase.database().ref("allrooms/" + roomId + "/pot").once("value", (snapshot) => {
                pot = snapshot.val().total
            })
            return pot
        }

        async function getAllIdLeft() {
            let allin = ""
            await firebase.database().ref("allrooms/" + roomId + "/allins").once("value", (snapshot) => {
                allin = snapshot.val().allin
            })
            let arr = allin.split(":")
            let ans = []
            for(let i = 1; i < arr.length; i++) {
                let id = await getThutuInRoom(arr[i])
                ans.push(id)
            }
            
            arr = []
            let cc = []
            await firebase.database().ref("allrooms/" + roomId + "/members").once("value", (snapshot) => {
                arr = Object.keys(snapshot.val())
                cc = snapshot.val()
            })
            for(let i = 0; i < arr.length; i++) {
                if(cc[arr[i]].active == 1) {
                    let id = await getThutuInRoom(arr[i])
                    ans.push(id)
                }
            }
            return ans
        }

        async function findWinner() {
            let cards = await getFullCards()
            // console.log(cards)
            let ids = await getAllIdLeft()
            let winnerId = ids[0]
            let someOneHand = await getSomeOneCard(winnerId)
            let winnerCards = getBestHand(cards.concat(someOneHand))[0]
            for(let i = 1; i < ids.length; i++) {
                someOneHand = await getSomeOneCard(ids[i])
                let keepCards = getBestHand(cards.concat(someOneHand))[0]
                let compare = compareTwoHand(winnerCards, keepCards)
                if(compare == -1) {
                    winnerCards = keepCards
                    winnerId = ids[i]
                }
            }
            // console.log(winnerId, winnerCards)
            await firebase.database().ref("allrooms/" + roomId + "/winner").set({
                "id": winnerId
            })
            return winnerId
        }

        async function getFlopCards() {
            let ans = []
            for(let i = 0; i < 3; i++) {
                let c = await getCard(i)
                ans.push(c)
            }
            return ans
        }

        async function getTurnCard() {
            let ans = await getCard(3)
            return ans
        }

        var allRiverCard = null

        async function getRiverCard() {
            let ans = await getCard(4)
            return ans
        }

        async function checkActivePlayer(id) {
            let uid = await getUserId(id)
            let kt = 0
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).once("value", (snapshot) => {
                kt = snapshot.val().active
            })
            return kt
        }

        async function checkNotAllIn(id) {
            let uid = await getUserId(id)
            let money = 0
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).once("value", (snapshot) => {
                money = snapshot.val().money
            })
            return (money > 0)
        }

        async function nextPlayer(id) {
            let t = -1
            await firebase.database().ref("allrooms/" + roomId + "/curPlayer").once("value", (snapshot) => {
                if(snapshot.exists()) t = snapshot.val().id
            })
            let n = await getNumberOfPlayers()            
            let kt = 0
            if(id != null) {
                t = id
                kt = 1
            }
            else {
                for(let i = 1; i < n; i++) {
                    t++
                    t %= n
                    if(await checkActivePlayer(t) && await checkNotAllIn(t)) {
                        kt = 1
                        break
                    }
                }
            }
            
            if(kt == 1)
            await firebase.database().ref("allrooms/" + roomId + "/curPlayer").set({
                "id": t
            })
            else {
                await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                    "action": "over"
                })
            }
            return t
        }

        async function getDealerId() {
            let t = 0
            await firebase.database().ref("allrooms/" + roomId + "/dealer").once("value", (snapshot) => {
                if(snapshot.exists()) t = snapshot.val().id
            })
            return t
        }

        async function initDealer() {
            let t = -1
            await firebase.database().ref("allrooms/" + roomId + "/dealer").once("value", (snapshot) => {
                if(snapshot.exists()) t = snapshot.val().id
            })
            t++
            let n = await getNumberOfPlayers()
            t %= n
            allPlayers = await getActivePlayers()
            for(let i = 0; i < allPlayers.length; i++) {
                $('.pos' + (i + 1) + " .player-money").html(allPlayers[t].money + "$")
            }
            // allPlayers[t].money -= 5
            
            // console.log(t)
            await firebase.database().ref("allrooms/" + roomId + "/dealer").set({
                "id": t
            })
            return t
        }

        var cannotCheck = 0

        async function addToCall(id, money) {
            let mems = []
            await firebase.database().ref("allrooms/" + roomId + "/members").once("value", (snapshot) => {
                let snap = snapshot.val()
                let t = Object.keys(snap)
                for(let i = 0; i < t.length; i++) {
                    if(i != id) mems.push(t[i])
                }
            })
            // console.log(mems)
            let arr = mems.map(async (mem) => {
                let curToCall = 0
                await firebase.database().ref("allrooms/" + roomId + "/members/" + mem).once("value", (snapshot) => {
                    // console.log(snapshot.hasChild("toCall"))
                    if(snapshot.hasChild("toCall")) {
                        // console.log(snapshot.val().toCall)
                        curToCall = snapshot.val().toCall
                    }
                })
                curToCall += money
                return firebase.database().ref("allrooms/" + roomId + "/members/" + mem).update({
                    "toCall": curToCall
                })
            })
            // console.log(arr)
            await Promise.all(arr)
        }

        async function removeToCall(id) {
            let uid = await getUserId(id)
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).update({
                "toCall": 0
            })
        }

        async function truTien(id, money) {
            let uid = await getUserId(id)
            let curMoney = 0
            let active = 1
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).once("value", (snapshot) => {
                curMoney = snapshot.val().money
                active = snapshot.val().active
            })
            // console.log("Cur money ", curMoney)
            if(active == 0) {
                return false
            }
            if(money > curMoney) return false
            curMoney = curMoney - money
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).update({
                "money": curMoney
            })
            return true
        }

        async function increaseStateOfPlayer(uid, a) {
            let curState = 0
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).once("value", (snapshot) => {
                curState = snapshot.val().state
            })
            if(a != null)
            curState += a
            else curState++
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).update({
                "state": curState
            })
        }

        async function increaseMoves(id) {
            let moves = 0
            await firebase.database().ref("allrooms/" + roomId + "/moves").once("value", (snapshot) => {
                moves = snapshot.val().total
            })
            if(id != null) moves = id - 1
            await firebase.database().ref("allrooms/" + roomId + "/moves").set({
                "total": moves + 1
            })
        }

        async function decreaseActivePlayers() {
            let n = 0
            await firebase.database().ref("allrooms/" + roomId + "/activePlayers").once("value", (snapshot) => {
                n = snapshot.val().total
            })
            await firebase.database().ref("allrooms/" + roomId + "/activePlayers").set({
                "total": n - 1
            })
        }

        async function initTurn() {
            over = 0
            // realStart = 1
            // await firebase.database().ref("allrooms/" + roomId + "/curPlayer").remove()
            let mems = []
            await firebase.database().ref("allrooms/" + roomId + "/members").once("value", async (snapshot) => {
                mems = Object.keys(snapshot.val())
            })
            await firebase.database().ref("allrooms/" + roomId + "/activePlayers").set({
                "total": mems.length
            })
            await firebase.database().ref("allrooms/" + roomId + "/moves").set({
                "total": 0
            })
            await firebase.database().ref("allrooms/" + roomId + "/pot").set({
                "total": 5
            })
            await firebase.database().ref("allrooms/" + roomId + "/allins").set({
                "allin": ""
            })
            let arr = mems.map((mem) => {
                return firebase.database().ref("allrooms/" + roomId + "/members/" + mem).update({
                    "active": 1,
                    "toCall": 0
                })
            })
            if(arr.length <= 1) {
                alert("Not enough people to start the next game, please wait for someone")
                $('.pot-total').html("Invite more people and start again")
                $('.turn-info').html("")
                $('.turn-info2').html("")
                joinedGame = 0
                await firebase.database().ref("allrooms/" + roomId + "/actions").remove()
                return
            }
            await Promise.all(arr)
            let dealerId = await initDealer()
            // let udeaderId = await getUserId(dealerId)
            // await increaseStateOfPlayer(udeaderId)
            await nextPlayer(dealerId)
            await truTien(dealerId, 5)
            let testcc = await getActivePlayers()
            await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                "action": "shuffle"
            })
            await firebase.database().ref("allrooms/" + roomId + "/turn").set({
                "turn": "Pre flop"
            })
        }

        async function addPot(money) {
            let curMoney = 0
            await firebase.database().ref("allrooms/" + roomId + "/pot").once("value", (snapshot) => {
                curMoney = snapshot.val().total
            })
            curMoney += money
            await firebase.database().ref("allrooms/" + roomId + "/pot").set({
                "total": curMoney
            })
        }

        async function moneyToCall(uid) {
            let toCall = 0
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).once("value", (snapshot) => {
                // console.log(snapshot.val())
                toCall = snapshot.val().toCall
            })
            return toCall
        }

        async function turnCheck() {
            dontSpam()
            if(yourTurn == 0) return
            let money = await moneyToCall(userId)
            // console.log(moneyToCall)
            if(money > 0) return
            yourTurn = 0
            $('.turn-info').html("Please wait...")
            $('.turn-info2').html("Please wait...")
            await increaseMoves()
            await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                "action": "check:" + userId
            })
        }

        var timeOut = null

        function startClock(s) {
            // console.log("ccc")
            if(joinedGame == 0 || yourTurn == 0) {
                clearTimeout(timeOut)
                return
            }
            $('.timer-container').html("Timer: " + s)
            if(s == 0) {
                turnFold()
                return
            }
            timeOut = setTimeout(() => {
                startClock(s - 1)
            }, 1000)
        }

        async function turnFold() {
            dontSpam()
            if(yourTurn == 0) return
            yourTurn = 0
            $('.turn-info').html("Please wait...")
            $('.turn-info2').html("Please wait...")
            // increaseMoves()
            await decreaseActivePlayers()
            await firebase.database().ref("allrooms/" + roomId + "/members/" + userId).update({
                "active": 0
            })
            await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                "action": "fold:" + userId
            })
        }

        async function turnAllIn() {
            dontSpam()
            if(yourTurn == 0) return
            yourTurn = 0
            $('.turn-info').html("Please wait...")
            $('.turn-info2').html("Please wait...")
            let curMoney = 0
            let id = await getThutuInRoom(userId)
            let toCall = await moneyToCall(userId)
            await firebase.database().ref("allrooms/" + roomId + "/members/" + userId).once("value", (snapshot) => {
                curMoney = snapshot.val().money
            })
            if(curMoney <= 0) {
                return false
            }
            await firebase.database().ref("allrooms/" + roomId + "/members/" + userId).update({
                "money": 0
            })
            await addPot(curMoney)
            if(curMoney > toCall) {
                await addToCall(id, curMoney - toCall)
                await removeToCall(id)
                await increaseMoves(0)
            } else {
                toCall -= curMoney
                await firebase.database().ref("allrooms/" + roomId + "/members/" + userId).update({
                    "toCall": toCall
                })
            }
            await firebase.database().ref("allrooms/" + roomId + "/members/" + userId).update({
                "active": 0
            })
            await decreaseActivePlayers()
            let curAllIns = ""
            await firebase.database().ref("allrooms/" + roomId + "/allins").once("value", (snapshot) => {
                if(snapshot.exists()) curAllIns = snapshot.val().allin
            })
            curAllIns = curAllIns + ":" + userId
            await firebase.database().ref("allrooms/" + roomId + "/allins").set({
                "allin": curAllIns
            })
            await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                "action": "allin:" + userId
            })
        }

        function turnRaise2() {
            let raiseVal = $('#customRange2').val()
            turnRaise(parseInt(raiseVal))
        }

        async function turnRaise(money) {
            dontSpam()
            if(yourTurn == 0) return
            let id = await getThutuInRoom(userId)
            let toCall = await moneyToCall(userId)
            if(money <= toCall) {
                return
            }
            let kt = await truTien(id, money)
            if(kt) {
                yourTurn = 0
                $('.turn-info').html("Please wait...")
                $('.turn-info2').html("Please wait...")
                await addPot(money)
                money -= toCall
                await increaseMoves(1)
                await removeToCall(id)
                await addToCall(id, money)
                await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                    "action": "raise:" + money + ":" + userId + ":" + (money + toCall)
                })
            }
        }

        async function turnCall() {
            dontSpam()
            if(yourTurn == 0) return
            let id = await getThutuInRoom(userId)
            let toCall = await moneyToCall(userId)
            let kt = await truTien(id, toCall)
            if(kt) {
                yourTurn = 0
                $('.turn-info').html("Please wait...")
                $('.turn-info2').html("Please wait...")
                await addPot(toCall)
                await increaseMoves()
                await removeToCall(id)
                await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                    "action": "call:" + userId + ":" + toCall
                })
            }
        }

        function getCurMoney() {
            if(joinedGame == 0) return 0
            if(allPlayers.length == 0) return 0
            let curMoney = allPlayers[userThutu].money
            return curMoney
        }

        function changeRaiseValue() {
            $('.raise-value span').html($('#customRange2').val())
        }

        function updateRaiseRange() {
            firebase.database().ref("allrooms/" + roomId + "/members/" + userId).once("value", (snapshot) => {
                if(!snapshot.exists()) {

                } else {
                    let curMoney = snapshot.val().money
                    if(curMoney != "0") {
                        $('#customRange2').attr("max", curMoney)
                        $('.raise-max span').html(curMoney)
                    }
                }
            })
            
        }

        firebase.database().ref("allrooms/" + roomId + "/curPlayer").on("value", async (snapshot) => {
            if(!snapshot.exists()) return
            if(over == 1) return
            let curId = snapshot.val().id
            let uid = await getUserId(curId)
            if(uid == userId) {
                // console.log("Your turn ", userId)
                yourTurn = 1
                if(joinedGame == 1)
                {
                $('.turn-info').html("Your turn")
                startClock(60)
                }
                // updateRaiseRange()
            } else {
                yourTurn = 0
                $('.turn-info').html(getUserName(uid) + "'s turn")
                // console.log("Not your turn", userId)
            }
        })

        firebase.database().ref("allrooms/" + roomId + "/dealer").on("value", async (snapshot) => {
            if(!snapshot.exists()) return
            if(joinedGame == 0) return
            let curId = snapshot.val().id
            let uid = await getUserId(curId)
            if(uid == userId) {
                // console.log("Your turn ", userId)
                yourTurn = 1
                if(joinedGame == 1)
                {
                $('.turn-info').html("Your turn")
                startClock(60)
                }
                // updateRaiseRange()
            } else {
                yourTurn = 0
                $('.turn-info').html(getUserName(uid) + "'s turn")
                // console.log("Not your turn", userId)
            }
        })

        async function checkEndOfRound() {
            let moves = 0
            let activePlayers = 0
            await firebase.database().ref("allrooms/" + roomId + "/moves").once("value", (snapshot) => {
                moves = snapshot.val().total
            })
            await firebase.database().ref("allrooms/" + roomId + "/activePlayers").once("value", (snapshot) => {
                activePlayers = snapshot.val().total
            })
            return (moves == activePlayers)
        }

        async function getCurTurnName() {
            let ans = ""
            await firebase.database().ref("allrooms/" + roomId + "/turn").once("value", async (snapshot) => {
                if(!snapshot.exists()) return
                ans = snapshot.val().turn
            })
            return ans
        }

        async function takeMoney(id) {
            over = 1
            // console.log("take money")
            let uid = await getUserId(id)
            if(uid != userId) return
            let curMoney = 0
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).once("value", (snapshot) => {
                curMoney = snapshot.val().money
            })

            let pot = 0
            await firebase.database().ref("allrooms/" + roomId + "/pot").once("value", (snapshot) => {
                pot = snapshot.val().total
            })
            await firebase.database().ref("allrooms/" + roomId + "/members/" + uid).update({
                "money": curMoney + pot
            })
            await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                "action": "over2:" + uid
            })
        }

        async function checkResult() {
            let winnerId = await findWinner()
            await takeMoney(winnerId)
        }

        async function getNumberOfActivePlayers() {
            let ans = 0
            await firebase.database().ref("allrooms/" + roomId + "/activePlayers").once("value", (snapshot) => {
                ans = snapshot.val().total
            })
            return ans
        }

        async function checkWinnerYet() {
            let numberActive = await getNumberOfActivePlayers()
            let allin = ""
            await firebase.database().ref("allrooms/" + roomId + "/allins").once("value", (snapshot) => {
                allin = snapshot.val().allin
            })
            let alls = allin.split(":")
            if(numberActive == 1 && allin == "") {
                let arr = await getAllIdLeft()
                await takeMoney(arr[0])
                return true
            }
            if(numberActive == 0 && alls.length == 2) {
                let wid = alls[1]
                let id = await getThutuInRoom(wid)
                await takeMoney(id)
                return true
            }
            return false
        }

        var allTurnCard = null

        async function doNextTurn(ktt) {
            updateRaiseRange()
            if(over == 1) return
            let pot = await getPot()
            $('.pot-total').html("Pot total: " + pot + "$")
            let kt2 = await checkWinnerYet()
            if(kt2) return
            let kt = 0
            if(ktt != null) kt = ktt
            else {
                kt = await checkEndOfRound()
                await firebase.database().ref("allrooms/" + roomId + "/actions").remove()
            }
            let curTurnName = await getCurTurnName()
            if(kt) {
                await firebase.database().ref("allrooms/" + roomId + "/moves").set({
                    "total": 0
                })
                if(curTurnName == "Pre flop") {
                    allFlopCards = await getFlopCards()
                    await firebase.database().ref("allrooms/" + roomId + "/turn").set({
                        "turn": "Flop"
                    })
                }
                if(curTurnName == "Flop") {
                    allTurnCard = await getTurnCard()
                    await firebase.database().ref("allrooms/" + roomId + "/turn").set({
                        "turn": "Turn"
                    })
                }
                if(curTurnName == "Turn") {
                    allRiverCard = await getRiverCard()
                    await firebase.database().ref("allrooms/" + roomId + "/turn").set({
                        "turn": "River"
                    })
                }
                if(curTurnName == "River") {
                    await checkResult()
                    await firebase.database().ref("allrooms/" + roomId + "/turn").set({
                        "turn": "checkResult"
                    })
                }
            }

            if(curTurnName != "checkResult")
                await nextPlayer()

        }

        function joinGameConfirm() {
            // console.log("join game")
            // if(joinedGame == 1) return
            joinGame()
            .then(() => {
                // console.log("joining")
                // $('.turn-info').html("Wating...")
                $('.turn-info2').html("Waiting...")
                $('.pot-total').html("Waiting...")
                $('.turn-name').html("...")
            })
        }

        function waitForSeconds(s) {
            if(s == 0) {
                initTurn()
            } else {
                setTimeout(() => {
                    waitForSeconds(s - 1)
                }, 1000)
            }
        }

        var askedToJoin = 0

        async function joinGame() {
            if(joinGame == 1) return
            if(askedToJoin == 0) {
                await firebase.database().ref("allrooms/" + roomId + "/members").remove()
            }
            joinedGame = 1
            let curMoney = 0
            await firebase.database().ref("allrooms/" + roomId + "/members2/" + userId).once("value", (snapshot) => {
                curMoney = snapshot.val().money
            })
            await firebase.database().ref("allrooms/" + roomId + "/members/" + userId).set({
                "active": 1,
                "money": curMoney
            })
            if(askedToJoin == 0)
            await firebase.database().ref("allrooms/" + roomId + "/actions").set({
                "action": "start:" + userId
            })
        }

        async function updateMem2() {
            let arr = []
            let cc = {}
            await firebase.database().ref("allrooms/" + roomId + "/members").once("value", (snapshot) => {
                if(!snapshot.exists()) return
                arr = Object.keys(snapshot.val())
                cc = snapshot.val()
            })
            // console.log(cc)
            if(arr == []) return
            for(let i = 0; i < arr.length; i++) {
                await firebase.database().ref("allrooms/" + roomId + "/members2/" + arr[i]).set({
                    "money": cc[arr[i]].money
                })
            }
            // await firebase.database().ref("allrooms/" + roomId + "/members").remove()
        }

        var userThutu = null

        async function showAllCard() {
            for(let i = 0; i < allPlayers.length; i++) {
                if(i != userThutu) {
                    let hisCard = await getSomeOneCard(i)
                    $(`.pos${i + 1}`).html(`
                    <div class="player-info-container">
                        <div class="player-name">
                            ${allPlayers[i].name}
                        </div>
                        <div class="player-money">
                            ${allPlayers[i].money}$
                        </div>
                    </div>
                    <div class="player-card-container mt-1">
                        <div class="player-card">
                            <div class="card-number-top">${getNumberOfCard(hisCard[0].split('-')[0])}</div>
                            <div class="card-type">
                                ${getTypeOfCard(hisCard[0].split('-')[1])}
                            </div>
                            <div class="card-number-bottom">${getNumberOfCard(hisCard[0].split('-')[0])}</div>
                        </div>
                        <div class="player-card">
                            <div class="card-number-top">${getNumberOfCard(hisCard[1].split('-')[0])}</div>
                            <div class="card-type">
                                ${getTypeOfCard(hisCard[1].split('-')[1])}
                            </div>
                            <div class="card-number-bottom">${getNumberOfCard(hisCard[1].split('-')[0])}</div>
                        </div>
                    </div>
                    `)
                }
            }
        }

        async function getActivePlayers() {
            let arr = []
            let cc = {}
            await firebase.database().ref("allrooms/" + roomId + "/members").once("value", (snapshot) => {
                if(!snapshot.exists()) return
                arr = Object.keys(snapshot.val())
                cc = snapshot.val()
            })
            let ans = []
            for(let i = 0; i < arr.length; i++) {
                if(arr[i] == userId) userThutu = i 
                ans.push({
                    "name": arr[i].split('-')[0],
                    "money": cc[arr[i]].money
                })
            }
            return ans
        }

        function getTypeOfCard(t) {
            if(t == "chuon") {
                return `<i class="fas fa-club"></i>`
            }
            if(t == "ro") {
                return `<i class="fas fa-diamond"></i>`
            }
            if(t == "bich") {
                return `<i class="fas fa-spade"></i>`
            }
            if(t == "co") {
                return `<i class="fas fa-heart"></i>`
            }
        }

        function getUserName(uid) {
            return uid.split('-')[0]
        }

        function getNumberOfCard(n) {
            if(n == "14") return "A"
            if(n == "11") return "J"
            if(n == "12") return "Q"
            if(n == "13") return "K"
            return n
        }

        var allFlopCards = []

        firebase.database().ref("allrooms/" + roomId + "/turn").on("value", async (snapshot) => {
            if(!snapshot.exists()) return
            let turn = snapshot.val().turn
            if(turn == "Flop") {
                allFlopCards = await getFlopCards()
                for(let i = 0; i < 3; i++) {
                    $('.all-card-container').append(`
                    <div class="player-card">
                        <div class="card-number-top">${getNumberOfCard(allFlopCards[i].split('-')[0])}</div>
                        <div class="card-type">
                            ${getTypeOfCard(allFlopCards[i].split('-')[1])}
                        </div>
                        <div class="card-number-bottom">${getNumberOfCard(allFlopCards[i].split('-')[0])}</div>
                    </div>
                    `)
                }
                $('.turn-name').html("Flop")
                return
            }
            if(turn == "Turn") {
                allTurnCard = await getTurnCard()
                $('.all-card-container').append(`
                    <div class="player-card">
                        <div class="card-number-top">${getNumberOfCard(allTurnCard.split('-')[0])}</div>
                        <div class="card-type">
                            ${getTypeOfCard(allTurnCard.split('-')[1])}
                        </div>
                        <div class="card-number-bottom">${getNumberOfCard(allTurnCard.split('-')[0])}</div>
                    </div>
                    `)
                    $('.turn-name').html("Turn")
                return
            }
            if(turn == "River") {
                allRiverCard = await getRiverCard()
                $('.all-card-container').append(`
                    <div class="player-card">
                        <div class="card-number-top">${getNumberOfCard(allRiverCard.split('-')[0])}</div>
                        <div class="card-type">
                            ${getTypeOfCard(allRiverCard.split('-')[1])}
                        </div>
                        <div class="card-number-bottom">${getNumberOfCard(allRiverCard.split('-')[0])}</div>
                    </div>
                    `)
                    $('.turn-name').html("River")
            }
        })

        var allPlayers = []

        function getCurPot() {
            let pot = $('.pot-total').html().split(" ")[2]
            pot = pot.split("$")[0]
            return parseInt(pot)
        }
 
        firebase.database().ref("allrooms/" + roomId + "/actions").on("value", async (snapshot) => {
            if(!snapshot.exists()) return
            let action = snapshot.val().action
            if(action == "shuffle") {
                if(joinedGame == 0) return
                $('#startgame').hide()
                $('.turn-info2').html("")
                if(yourTurn == 1) {
                    $('.turn-info').html("Your turn")
                    startClock(60)
                } else {
                    $('.turn-info').html("Not your turn")
                }
                over = 0
                let activePlayers = await getActivePlayers()
                allPlayers = activePlayers
                // console.log(activePlayers)
                await shuffleCard()
                let yourCards = await getYourCard()
                // console.log(yourCards)
                for(let i = 0; i < activePlayers.length; i++) {
                    if(i == userThutu) {
                        $('.pokertable').append(
                        `<div class="player-container pos${i + 1}">
                            <div class="player-info-container">
                                <div class="player-name">
                                    ${activePlayers[i].name}
                                </div>
                                <div class="player-money">
                                    ${activePlayers[i].money}$
                                </div>
                            </div>
                            <div class="player-card-container mt-1">
                                <div class="player-card">
                                    <div class="card-number-top">${getNumberOfCard(yourCards[0].split('-')[0])}</div>
                                    <div class="card-type">
                                        ${getTypeOfCard(yourCards[0].split('-')[1])}
                                    </div>
                                    <div class="card-number-bottom">${getNumberOfCard(yourCards[0].split('-')[0])}</div>
                                </div>
                                <div class="player-card">
                                    <div class="card-number-top">${getNumberOfCard(yourCards[1].split('-')[0])}</div>
                                    <div class="card-type">
                                        ${getTypeOfCard(yourCards[1].split('-')[1])}
                                    </div>
                                    <div class="card-number-bottom">${getNumberOfCard(yourCards[1].split('-')[0])}</div>
                                </div>
                            </div>
                        </div>`)
                    } else {
                        $('.pokertable').append(
                            `<div class="player-container pos${i + 1}">
                            <div class="player-info-container">
                                <div class="player-name">
                                    ${activePlayers[i].name}
                                </div>
                                <div class="player-money">
                                    ${activePlayers[i].money}$
                                </div>
                            </div>
                            <div class="player-card-container mt-1">
                                <div class="player-card bimat">
                                </div>
                                <div class="player-card bimat">
                                </div>
                            </div>
                        </div>`
                        )
                    }
                }
                $('.pot-total').html("Pot total: 5$")
                $('.turn-name').html("Pre flop")
                $('.all-card-container').html("")
                if(joinedGame == 1)
                updateRaiseRange()
                return
            }
            if(action == "over") {
                await doNextTurn(1)
                await doNextTurn(1)
                await doNextTurn(1)
                await doNextTurn(1)
                await doNextTurn(1)
            }
            let t = action.split(":")
            if(t[0] == "over2") {
                over = 1
                await updateMem2()
                await firebase.database().ref("allrooms/" + roomId + "/curPlayer").remove()
                joinedGame = 0
                askedToJoin = 0
                // console.log("Turn Over, winner is ", t[1])
                let keep = getUserName(t[1])
                $('.turn-info2').html("Game over, winner is " + keep)
                allPlayers = await getActivePlayers()
                $('.turn-info').html("")
                await showAllCard()
                for(let i = 0; i < allPlayers.length; i++) {
                    if(allPlayers[i].name == keep) {
                        allPlayers[i].money = parseInt(allPlayers[i].money)
                        $('.pos' + (i + 1) + " .player-money").html(allPlayers[i].money + "$")
                    }
                }
                $('#startgame').show()
                // if(userId == t[1]) {
                //     await nextGame();
                // }
            }
            if(t[0] == "check") {
                $('.turn-info2').html(`User ${getUserName(t[1])} checked`)
                let toCall = await moneyToCall(userId)
                if(t[1] != userId)
                $('.turn-info2').append(`<br/> You got ${toCall} to call`)
                await doNextTurn()
            }
            if(t[0] == "raise") {
                let keep = getUserName(t[2])
                $('.turn-info2').html(`User ${keep} just raised ${t[1]}$`)
                for(let i = 0; i < allPlayers.length; i++) {
                    if(allPlayers[i].name == keep) {
                        allPlayers[i].money = parseInt(allPlayers[i].money) - parseInt(t[3])
                        $('.pos' + (i + 1) + " .player-money").html(allPlayers[i].money + "$")
                    }
                }
                let toCall = await moneyToCall(userId)
                if(t[2] != userId)
                $('.turn-info2').append(`<br/> You got ${toCall} to call`)
                await doNextTurn()
            }
            if(t[0] == "call") {
                let keep = getUserName(t[1])
                $('.turn-info2').html(`User ${keep} just called`)
                let toCall = await moneyToCall(userId)
                if(t[1] != userId)
                $('.turn-info2').append(`<br/> You got ${toCall} to call`)
                for(let i = 0; i < allPlayers.length; i++) {
                    if(allPlayers[i].name == keep) {
                        allPlayers[i].money = parseInt(allPlayers[i].money) - parseInt(t[2])
                        $('.pos' + (i + 1) + " .player-money").html(allPlayers[i].money + "$")
                    }
                }
                await doNextTurn()
                // updateRaiseRange()
            }
            if(t[0] == "allin") {
                let keep = getUserName(t[1])
                $('.turn-info2').html(`User ${keep} just all in`)
                for(let i = 0; i < allPlayers.length; i++) {
                    if(allPlayers[i].name == keep) {
                        allPlayers[i].money = parseInt(allPlayers[i].money) - parseInt(t[2])
                        $('.pos' + (i + 1) + " .player-money").html("0$")
                    }
                }

                let toCall = await moneyToCall(userId)
                if(t[1] != userId)
                $('.turn-info2').append(`<br/> You got ${toCall} to call`)
                await doNextTurn()
            }
            if(t[0] == "fold") {
                $('.turn-info2').html(`User ${getUserName(t[1])} just folded`)
                let toCall = await moneyToCall(userId)
                if(t[1] != userId)
                $('.turn-info2').append(`<br/> You got ${toCall} to call`)
                await doNextTurn()
            }
            if(t[0] == "start") {
                let curTime = new Date().getTime()
                if(curTime - antiSpam2 <= 1000) {
                    await firebase.database().ref("allrooms/" + roomId + "/actions").remove()
                    return
                }
                askedToJoin = 1
                let curMoney = 0
                await firebase.database().ref("allrooms/" + roomId + "/members2/" + userId).once("value", (snapshot) => {
                    curMoney = snapshot.val().money
                })
                if(parseInt(curMoney) <= 0) {
                    $('.turn-info').html("You ran out of money, cannot join or start a game")
                    return
                }
                if(userId == t[1]) {
                    waitForSeconds(10)
                    // return
                } else {
                    $('#startgame').click()
                    $('.modal-body').html(`User ${getUserName(t[1])} started next game, click join game and wait for about 10s`)
                
                }
                
            }
        }) 

        // function 