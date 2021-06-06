// To increase quantity
function up(btnId)
{
    var temp = btnId.charAt(4);
    var val = 'pp'+temp;
    var pdtID = document.getElementById(val).innerText;
    //total amt in cart
    var amt   = parseInt(document.getElementById('amountSummary').innerText);
    //unit price of selected item
    var up    = (document.getElementById('unitPrice').innerText)
    up   =  up.replace("₹ ","")
    var myNumber = "myNumber"+temp;
    //no of units of selected item already in cart 
    var newQuan =   parseInt(document.getElementById(myNumber).value);
    //reduce the item cost totally from amt
    amt = amt - (up*newQuan);
    newQuan   = newQuan + 1;
    if(newQuan>20)
    {
            newQuan = 20;
            amt = amt + (up*20);
    }
    else
    {
        amt = amt + (up*newQuan)
        var changeTotal = document.getElementById('totalItemsInCart').innerText;
        changeTotal = parseInt(changeTotal) +1;
        document.getElementById('totalItemsInCart').innerText = changeTotal;
    }
    document.getElementById(myNumber).value = newQuan;
    document.getElementById('amountSummary').innerText = amt
    if(amt<1000)
    {
        amt = amt+40;
    }
    document.getElementById('final').innerText = amt;
    alert(amt)
    axios.post('/incrementQuantity/'+pdtID,{incre : newQuan}).then(data=>{
        console.log(data)
    }).catch(err=>{
        console.log(err)
    })    
}


// To decrease quantity
function down(btnId)
{
    var temp = btnId.charAt(4);
    var val = 'pp'+temp;
    var pdtID = document.getElementById(val).innerText;
    //total amt in cart
    var amt   = parseInt(document.getElementById('amountSummary').innerText);
    //unit price of selected item
    var up    = (document.getElementById('unitPrice').innerText)
    up   =  up.replace("₹ ","")
    var myNumber = "myNumber"+temp;
    //no of units of selected item already in cart 
    var newQuan =   parseInt(document.getElementById(myNumber).value);
    if(newQuan===1)
        return;
    //reduce the item cost totally from amt
    amt = amt - (up*newQuan);
    newQuan   = newQuan - 1;
    if(newQuan<1)
    {
            newQuan = 1;
            amt = amt + up;
    }
    else
    {
        amt = amt + (up*newQuan)
        var changeTotal = document.getElementById('totalItemsInCart').innerText;
        changeTotal = parseInt(changeTotal) -1;
        document.getElementById('totalItemsInCart').innerText = changeTotal;
    }
    document.getElementById(myNumber).value = newQuan;
    document.getElementById('amountSummary').innerText = amt
    if(amt<1000)
    {
        amt = amt+40;
    }
    document.getElementById('final').innerText = amt;
    axios.post('/incrementQuantity/'+pdtID,{incre : newQuan}).then(data=>{
        console.log(data)
    }).catch(err=>{
        console.log(err)
    })    
}


