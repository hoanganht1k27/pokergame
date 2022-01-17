const typeOfCard = [
    "No Pair", "One Pair", "Two Pairs", "Three of a kind", "Straight", "Flush", "Full house", "Four of a kind", "Straight Flush"
]

// 1-ro
function checkNoPair(cards) {
    let arr = {}
    let c = []
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        c.push(n)
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    c.sort(function(a, b){return a - b})
    return c
}

function checkOnePair(cards) {
    let arr = {}
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    let ans = []
    let x = 0
    Object.keys(arr).forEach((a) => {
        if(arr[a] > 1) x = parseInt(a)
        else ans.push(parseInt(a))
    })
    ans.sort(function(a, b){return a - b})
    ans.push(x)
    if(x == 0) return false
    return ans
}

function checkTwoPair(cards) {
    let arr = {}
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    let ans = []
    let keep = []
    Object.keys(arr).forEach((a) => {
        if(arr[a] > 1) keep.push(parseInt(a))
        else ans.push(parseInt(a))
    })
    keep.sort(function(a, b){return a - b})
    ans.sort(function(a, b){return a - b})
    if(keep.length < 2) return false
    ans.push(keep[0])
    ans.push(keep[1])
    return ans
}

function checkThreeOfAKind(cards) {
    let arr = {}
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    let ans = []
    let x = 0
    Object.keys(arr).forEach((a) => {
        if(arr[a] > 2) x = parseInt(a)
        else ans.push(parseInt(a))
    })
    if(x == 0) return false
    ans.sort(function(a, b){return a - b})
    ans.push(x)
    return ans
}

function specialStraight(cards) {
    let arr = {}
    let ans = []
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        ans.push(n)
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    ans.sort(function(a, b){return a - b})
    if(ans[0] == 2 && ans[1] == 3 && ans[2] == 4 && ans[3] == 5 && ans[4] == 14) {
        return 1
    }
    return false
}

function checkStraight(cards) {
    let arr = {}
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    let c = Object.keys(arr)
    for(let i = 0; i < c.length; i++) {
        c[i] = parseInt(c[i])
    }
    c.sort(function(a, b){return a - b})
    // console.log(c)
    for(let i = 0; i < 1; i++) {
        let keep = i + 1
        while(keep < i + 5 && c[keep] == c[keep - 1] + 1) {
            keep++
        }         
        if(keep == i + 5) {
            return c[0]
        }
    }
    return specialStraight(cards)
}

function checkFlush(cards) {
    let arr = {}
    let tt = []
    cards.forEach((card) => {
        let t = card.split("-")
        tt.push(parseInt(t[0]))
        let n = t[1]
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    let ans = 0
    // console.log(arr)
    Object.values(arr).forEach((t) => {
        if(t >= 5) ans = 1
    })
    if(ans == 0) return false
    tt.sort(function(a, b){return a - b})
    return tt
}

function checkFullHouse(cards) {
    let arr = {}
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    let three = 0
    let two = 0
    // console.log(arr)
    Object.keys(arr).forEach((x) => {
        if(arr[x] == 3) three = parseInt(x)
        if(arr[x] == 2) two = parseInt(x)
    })
    if(three == 0 || two == 0) return false
    return [two, three]
}

function checkFourOfAKind(cards) {
    let arr = {}
    let ans = []
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        ans.push(n)
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    let kt = 0
    // console.log(arr)
    Object.keys(arr).forEach((x) => {
        if(arr[x] >= 4) {
            kt = 1
        }
    })
    if(kt == 0) return false
    ans.sort(function(a, b){return a - b})
    return ans
}

function checkStraightFlush(cards) {
    let arr = {}
    cards.forEach((card) => {
        let t = card.split("-")
        let n = parseInt(t[0])
        if(arr[n]) {
            arr[n]++;
        } else arr[n] = 1
    });
    let c = Object.keys(arr)
    for(let i = 0; i < c.length; i++) {
        c[i] = parseInt(c[i])
    }
    c.sort(function(a, b){return a - b})
    // console.log(c)
    for(let i = 0; i < 1; i++) {
        let keep = i + 1
        while(keep < i + 5 && c[keep] == c[keep - 1] + 1) {
            keep++
        }         
        if(keep == i + 5) {
            if(checkFlush(cards)) return c[0]
        }
    }
    if(specialStraight(cards) && checkFlush(cards)) return 10
    return false
}

function get5(cards) {
    let res = []
    let ans = []
    
    function ql(i, k) {
        if(k == 5) {
            ans.push(res.map((x) => {
                return x
            }))
            return
        }
        for(let j = i + 1; j < 7; j++) {
            res.push(cards[j])
            ql(j, k + 1)
            res.pop(cards[j])
        }
    }

    ql(-1, 0)
    
    return ans
}

function getBestHand(cards) {
    let arr = get5(cards)
    let res = []
    let ans = 0
    arr.forEach((a) => {
        // ans = Math.max(ans, checkRankOfHand(a))
        let t = checkRankOfHand(a)
        if(t >= ans) {
            ans = t
            if(res.length == 0 || compareTwoHand(res, a) == -1) res = a
        }
    })
    // console.log(typeOfCard[ans])
    return [res, ans]
}

// let test = ["2-ro", "4-chuon", "3-co", "4-ro", "5-ro", "14-ro", "10-bich"]
// let test1 = ['12-ro', '13-ro', '14-ro', '12-bich', '6-bich']
// let test2 = ['12-ro', '13-ro', '12-bich', '11-ro', '14-chuon']

function checkRankOfHand(cards) {
    if(checkStraightFlush(cards)) return 8
    if(checkFourOfAKind(cards)) return 7
    if(checkFullHouse(cards)) return 6
    if(checkFlush(cards)) return 5
    if(checkStraight(cards)) return 4
    if(checkThreeOfAKind(cards)) return 3
    if(checkTwoPair(cards)) return 2
    if(checkOnePair(cards)) return 1
    if(checkNoPair(cards)) return 0
}

function compareTwoHand(cards1, cards2) {
    let t1 = checkRankOfHand(cards1)
    let t2 = checkRankOfHand(cards2)
    if(t1 < t2) return -1
    if(t1 > t2) return 1
    t1++
    if(t1 == 1) {
        let c1 = checkNoPair(cards1)
        let c2 = checkNoPair(cards2)
        for(let i = 4; i >= 0; i--) {
            if(c1[i] < c2[i]) return -1
            if(c1[i] > c2[i]) return 1
        }
    }
    if(t1 == 2) {
        let c1 = checkOnePair(cards1)
        let c2 = checkOnePair(cards2)
        // console.log(c1, c2)
        for(let i = 3; i >= 0; i--) {
            if(c1[i] < c2[i]) return -1
            if(c1[i] > c2[i]) return 1
        }
    }
    if(t1 == 3) {
        let c1 = checkTwoPair(cards1)
        let c2 = checkTwoPair(cards2)
        for(let i = 2; i >= 0; i--) {
            if(c1[i] < c2[i]) return -1
            if(c1[i] > c2[i]) return 1
        }
    }
    if(t1 == 4) {
        let c1 = checkThreeOfAKind(cards1)
        let c2 = checkThreeOfAKind(cards2)
        for(let i = 2; i >= 0; i--) {
            if(c1[i] < c2[i]) return -1
            if(c1[i] > c2[i]) return 1
        }
    }
    if(t1 == 5) {
        let c1 = checkStraight(cards1)
        let c2 = checkStraight(cards2)
        if(c1 < c2) return -1
        if(c1 > c2) return 1
    }
    if(t1 == 6) {
        let c1 = checkFlush(cards1)
        let c2 = checkFlush(cards2)
        for(let i = 4; i >= 0; i--) {
            if(c1[i] < c2[i]) return -1
            if(c1[i] > c2[i]) return 1
        }
    }
    if(t1 == 7) {
        let c1 = checkFullHouse(cards1)
        let c2 = checkFullHouse(cards2)
        for(let i = 1; i >= 0; i--) {
            if(c1[i] < c2[i]) return -1
            if(c1[i] > c2[i]) return 1
        }
    }
    if(t1 == 8) {
        let c1 = checkFourOfAKind(cards1)
        let c2 = checkFourOfAKind(cards2)
        for(let i = 1; i >= 0; i--) {
            if(c1[i] < c2[i]) return -1
            if(c1[i] > c2[i]) return 1
        }
    }
    if(t1 == 9) {
        let c1 = checkStraightFlush(cards1)
        let c2 = checkStraightFlush(cards2)
        if(c1 < c2) return -1
        if(c1 > c2) return 1
    }
    return 0
}