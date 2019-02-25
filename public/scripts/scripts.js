var localUser = localStorage.getItem("currentUser");

if (document.title == "P,R,S - User Details") {
	var up = document.getElementById("updatedUser");
	if (up.innerHTML != "") {
		localStorage.setItem("currentUser", up.innerHTML);
		var localUser = localStorage.getItem("currentUser");
	}
}

if (document.title == "P,R,S - Game") {
	var userBox = document.getElementById("userBox").innerHTML;
	if (!localUser && userBox != "") {
		localStorage.setItem('currentUser', userBox);
		localUser = localStorage.getItem("currentUser");
	}
	if (!localUser) {
		window.location.replace("/");
	} else {
		//document.getElementById("greeter").textContent = localUser[0].toUpperCase() + localUser.substring(1) + ", it's your turn to bust a move!";
		document.getElementById("gameForm").action = "/user/" + localUser + "/results";
	}
	window.addEventListener("load", function () {
		var refImg = document.getElementById("refImage");
		refImg.className = "greenSVG";
		setTimeout(onTimerElapsed, 1000);
	});

	villainChoice = document.getElementById("villainChoice");
	villainChoice.onchange = function () {
		if (villainChoice.value == "") {
			document.getElementById("villainWaitingHand").innerHTML = "";
			document.getElementById("villainWaitingHand").classList.remove("bodydiv");
			document.getElementById("villainWaitingHand").classList.add("hidden");
		} else {
			document.getElementById("villainWaitingHand").classList.remove("hidden");
			document.getElementById("villainWaitingHand").classList.add("bodydiv");
			var vilName = villainChoice.value.toLowerCase().split(' ').join('_').split('.').join('');
			document.getElementById("villainWaitingHand").innerHTML = "<p>" + villainChoice.value + " is ready.</p><br><img id='" + vilName + "' class='villainWaitingImg' src='/images/" + vilName + "_waiting.svg'>";
		}
	}


}

if (document.title == "P,R,S - Index") { //handles login checking and redirection
	if (localUser) {
		var found = false;
		document.getElementById("userBox").innerHTML.slice(0, -1).split(",").forEach(function (a) {
			if (a == localUser) {
				found = true;
				window.location.replace("/game");
			}
		});
		if (!found) {
			document.getElementById("headerLogout").innerHTML = "";
			localStorage.clear();
			localUser = localStorage.getItem("currentUser");
		}
	} else {
		document.getElementById("headerLogout").innerHTML = "";
	}
}


if (localUser) { //if user is already logged in
	document.getElementById("headerDivider").innerHTML = "|";
	document.getElementById("headerLogout").innerHTML = "Log Out";
	if (document.title == "P,R,S - User Details") {
		document.getElementById("headerGreeter").innerHTML = "Logged in as " + localUser;
	} else {
		document.getElementById("headerGreeter").innerHTML = "Logged in as " + localUser + " | ";
	}
	document.getElementById("headerEdit").innerHTML = "Edit Account Info";
	document.getElementById("headerEdit").href = "/users/" + localUser + "/edit";
	document.getElementById("statsLink").href = "/stats?username=" + localUser;

} else {
	if (document.title != "P,R,S - Index") {
		document.getElementById("headerLogout").innerHTML = "Log In";
	}
	document.getElementById("headerLogout").href = "/";
	document.getElementById("headerGreeter").innerHTML = "";
	document.getElementById("headerEdit").innerHTML = "";
}

document.getElementById("headerLogout").addEventListener("click", function () {
	localStorage.clear();
	window.location.replace("/");
});

function onTimerElapsed() { //handles ref actions
	var refText = document.getElementById("referee-text");
	var refImg = document.getElementById("refImage");
	if (refText.textContent == 'Referee: "Three!"') {
		refText.textContent = 'Referee: "Two!"';
		refImg.src = "/images/ref/two.svg";
		refImg.className = "greenSVG";
		setTimeout(onTimerElapsed, 1000);
	} else if (refText.textContent == 'Referee: "Two!"') {
		refText.textContent = 'Referee: "One!"';
		refImg.src = "/images/ref/one.svg";
		refImg.className = "greenSVG";
		setTimeout(onTimerElapsed, 1000);
	} else if (refText.textContent == 'Referee: "One!"') {
		refText.textContent = 'Referee: "Shoot!"';
		refImg.src = "/images/ref/shoot.svg";
		refImg.className = "greenSVG";
		setTimeout(onTimerElapsed, 2500);
	} else if (refText.textContent == 'Referee: "Shoot!"') {
		refText.textContent = 'Referee: "Hurry up."';
		refImg.src = "/images/ref/watch.svg";
		refImg.className = "redSVG";
		clearInterval(onTimerElapsed);
	}
}

if (document.title == "P,R,S - User Details") {
	document.getElementById("headerEdit").innerHTML = "";
	document.getElementById("headerEdit").href = "/";
}