var drag = {
	// 使窗口可以拖动
	drag: function(handle, oDrag, olMap) {
		handle = handle || oDrag;
		handle.style.cursor = "move";
		let clientWidth = document.documentElement.clientWidth;
		let clientHeight = document.documentElement.clientHeight;
		let mapEventControler = true;
		let marginLeft = $(oDrag).css('margin-left');
		marginLeft = marginLeft.replace('px');
		let leftAbs = Math.abs(parseInt(marginLeft));
		handle.onmousedown = function(event) {
			event = event || window.event;
			oDrag.style.zIndex = '10';
			let disX = event.clientX - oDrag.offsetLeft;
			let disY = event.clientY - oDrag.offsetTop;
			mapEventControler = true;
			document.onmousemove = function(devent) {
				devent = devent || window.devent;
				let iL = devent.clientX - disX - parseInt(marginLeft);
				let iT = devent.clientY - disY;
				let maxL = document.documentElement.clientWidth - oDrag.offsetWidth - parseInt(marginLeft);
				let maxT = document.documentElement.clientHeight - oDrag.offsetHeight;
				if (iL <= leftAbs) {
					iL = leftAbs;
				}
				if (iT <= 0) {
					iT = 0;
				}
				if (iL >= maxL) {
					iL = maxL;
				}
				if (iT >= maxT) {
					iT = maxT;
				}
				oDrag.style.left = iL + "px";
				oDrag.style.top = iT + "px";
				return false;
			};
			handle.onmouseout = function() {
				if (olMap) {
					olMap.on("mousemove", olMap, function(e) {
						if (mapEventControler) {
							let iL = e.pageX - disX - parseInt(marginLeft);
							let iT = e.pageY - disY;
							let maxL = clientWidth - oDrag.offsetWidth - parseInt(marginLeft);
							let maxT = clientHeight - oDrag.offsetHeight;
							if (iL <= leftAbs) {
								iL = leftAbs;
							}
							if (iT <= 0) {
								iT = 0;
							}
							if (iL >= maxL) {
								iL = maxL;
							}
							if (iT >= maxT) {
								iT = maxT;
							}
							oDrag.style.left = iL + "px";
							oDrag.style.top = iT + "px";
							return false;
						}
					});
					olMap.on("mouseup", olMap, function(e) {
						mapEventControler = false;
						document.onmousemove = null;
						document.onmouseup = null;
						oDrag.style.zIndex = '10';
					});
				}
			};
			document.onmouseup = function() {
				document.onmousemove = null;
				document.onmouseup = null;
				mapEventControler = false;
				oDrag.style.zIndex = '10';
			};
			return false;
		};
	}
}

module.exports = drag;