var vm;
if (navigator.userAgent.indexOf('Html5Plus') != -1 && !window.plus)
	document.addEventListener('plusready', init);
else init();

function init() {
	'use strict';

	//f7
	var myApp = new Framework7({
		pushState: true,
	});
	var $$ = Dom7;
	var mainView = myApp.addView('.view-main', {
		domCache: true,
		dynamicNavbar: true,
	});
	var myMessagebar = myApp.messagebar('.messagebar', {
		maxHeight: 200,
	});
	myApp.messages('.messages', {
		autoLayout: false
	});
	$$(document).on('pageBeforeAnimation', function(e) {
		var page = e.detail.page;
		if (page.name == 'chat') {
			if (vm.conv && vm.conv.id == page.query.convId) {
				scrollBottom();
				return;
			} //刚才打开的聊天页面再次打开时直接打开
			vm.conv = convObj[page.query.convId];
			vm.msgs = [];
			vm.conv.queryMessages().then(function(messages) {
				vm.msgs = messages;
				scrollBottom();
			}).catch(console.error.bind(console));
		}
	});

	//init events
	if (window.plus) {
		plus.key.addEventListener("backbutton", function() {
			if ($$('.view-main').data('page') == 'conv') {
				if (confirm('确定退出？'))
					plus.runtime.quit();
			} else {
				mainView.router.back();
			}
		});
	}
	$$('#sign-in-form').submit(signIn);
	$$('#sign-up-form').submit(signUp);
	$$('#user-btn').click(function() {
		myApp.actions([
			[{
				text: '注销',
				onClick: signOut
			}],
			[{
				text: '取消',
				color: 'red'
			}]
		]);
	});
	$$('#new-conv-form').submit(createConv);
	//保证输入法弹出后消息位置不变
	var oldHeight = document.body.clientHeight,
		ms = $$('#messages-scroll')[0];
	window.onresize = function() {
		var newHeight = document.body.clientHeight;
		if (ms.scrollHeight != ms.scrollTop + $$(ms).height())
			$$('#messages-scroll')[0].scrollTop += oldHeight - newHeight;
		oldHeight = newHeight;
	}
	$$('#send-button').click(sendNewMsg);
	$$('#img-input').change(sendImg);
	$$('#file-input').change(sendFile);
	$$('#open-sign-up').click(function() {
		vm.showSignUp = true
	});
	$$('#back-sign-in').click(function() {
		vm.showSignUp = false
	});
	//and observers
	if (window.MutationObserver) {  //输入换行后不盖住消息
		var observer = new MutationObserver(function(mutations) {
			scrollBottom();
		});
		observer.observe(document.getElementById('new-msg-area'), {
			attributes: true,
			attributeFilter: ['style']
		});
	}

	//leanCloud
	var APP_ID = 'hpmhUmm2XYFuaUnkbOlipmJ5-gzGzoHsz';
	AV.init({appId: APP_ID, appKey:'5fYSVHbS2w1JmWuP77KVu7uJ'});
	var convObj = {};  //对话索引
	var rt = new AV.Realtime({
		appId: APP_ID,
		plugins: [AV.TypedMessagesPlugin], // 注册富媒体消息插件
	});
	var Feedback = AV.Object.extend('Feedback');

	//vue
	if (localStorage.options == null)  //默认设置
		localStorage.options = JSON.stringify({
			enterSend: true,
			nightMode: false,
		});
	vm = new Vue({
		el: '#app',
		data: {
			AV: AV,
			conv: null,
			convs: [],
			imUserObj: null,
			msgs: [],
			newConvMembers: '',
			newMsg: '',
			options: JSON.parse(localStorage.options),
			password: '',
			showSignUp: false,
			signUp: {
				userName: '',
				password: '',
				password2: ''
			},
			today: new Date(),
			userName: '',
			userObj: null,
		},
		methods: {
			delConv: function(i) {
				this.convs[i].send(new AV.TextMessage(vm.userName + '已离开对话')).then(function(message) {
					vm.convs[i].quit();
					delete convObj[vm.convs[i].id];
					vm.convs.splice(i, 1);
				}).catch(console.error.bind(console));
			},
			exceptSelf: function(m) {
				var mm = [];
				if (Array.from) {
					mm = Array.from(m);
				} else {
					for (var i in m) mm[i] = m[i];
				}
				mm.splice(mm.indexOf(this.userName), 1);
				return mm;
			},
			handleEnter: function(e) {
				if (!this.options.enterSend) return;
				e.preventDefault();
				sendNewMsg();
			},
			saveOp: function() {
				localStorage.options = JSON.stringify(this.options);
			},
			sendFeedback: function() {
				var query = new AV.Query('Feedback');
				query.equalTo('user', vm.userName).find().then(function(results) {
					var fb;
					if (results.length == 0) {
						fb = new Feedback();
					} else {
						fb = results[0];
					}
					fb.set('user', vm.userName);
					fb.set('text', $$('#feedback-area').val());
					fb.save().then(function() {
						alert('反馈发送成功');
					});
				});
			},
			sendImg: function() {
			},
			timeToString: function(d) {
				if (d == null) return '';
				var time = appendZero(d.getHours()) + ':' + appendZero(d.getMinutes());
				if (d.toLocaleDateString() == this.today.toLocaleDateString())
					return time;
				else if (d.getYear() == this.today.getYear())
					return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + time;
				else return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + time;
			}
		}
	});

	//functions
	function appendZero(obj) {
		if (obj < 10) return "0" + obj;
		else return obj;
	}

	function createConv(e) {
		e.preventDefault();
		$$('#new-conv-input').blur();
		if (vm.newConvMembers.trim() == '') {
			alert('用户名不能为空');
			return;
		}
		var members = vm.newConvMembers.split(',').map(function(m) {
			return m.trim()
		});
		if (members.indexOf('') != -1) {
			alert('用户名不能为空');
			return;
		}

		showWaiting('处理中...');
		vm.imUserObj.createConversation({
			members: members,
			unique: true,
		}).then(function(conversation) {
			vm.newConvMembers = '';
			if (conversation.lastMessage == null) conversation.lastMessage = {
				text: ''
			};
			if (convObj[conversation.id] == null) {
				conversation.send(new AV.TextMessage(vm.userName + '创建了对话')).then(function(message) {
					convObj[conversation.id] = conversation;
					mainView.router.load({
						pageName: 'chat',
						query: {
							convId: conversation.id
						}
					});
				});
			} else mainView.router.load({
				pageName: 'chat',
				query: {
					convId: conversation.id
				}
			});
			closeWaiting();
		});
	}

	function scrollBottom(t) {
		if (t)
			setTimeout(function(){
				$$('#messages-scroll').scrollTop(1000000);
			}, t);
		else Vue.nextTick(function() {
			$$('#messages-scroll').scrollTop(1000000);
		});
	}
	function sendFile() {
		var fileUploadControl = $$('#file-input')[0];
		var file = new AV.File(fileUploadControl.files[0].name, fileUploadControl.files[0]);
		file.save().then(function(f) {
			var message = new AV.FileMessage(f);
			return vm.conv.send(message);
		}).then(function(m) {
			console.log(m.getFile());
			vm.msgs.push(m);
			scrollBottom(200);
			myApp.closeModal('.attach-picker');
		}).catch(console.error.bind(console));
	}
	function sendImg() {
		var fileUploadControl = $$('#img-input')[0];
		var file = new AV.File(fileUploadControl.files[0].name, fileUploadControl.files[0]);
		file.save().then(function(f) {
			var message = new AV.ImageMessage(f);
			return vm.conv.send(message);
		}).then(function(m) {
			vm.msgs.push(m);
			scrollBottom(200);
			myApp.closeModal('.attach-picker');
		}).catch(console.error.bind(console));
	}
	function sendNewMsg() {
		vm.conv.send(new AV.TextMessage(vm.newMsg)).then(function(message) {
			myMessagebar.clear();
			vm.msgs.push(message);
			scrollBottom();
		}).catch(console.error.bind(console));
	}

	function signIn(e) {
		if (e) e.preventDefault();
		$$('#sign-in-password')[0].blur();
		if (vm.userName.trim() == '') {
			alert('用户名不能为空！');
		} else if (vm.password.length < 6) {
			alert('密码最短6位！');
		} else {
			showWaiting('登录中 ...');
			AV.User.logIn(vm.userName, vm.password).then(function(loggedUser) {
				vm.userObj = loggedUser;
				closeWaiting();
				myApp.closeModal('.login-screen');
				vm.password = '';
				showWaiting('获取对话 ...');
				rt.createIMClient(vm.userName).then(function(imClient) {
					vm.imUserObj = imClient;
					vm.imUserObj.getQuery().containsMembers([vm.userName]).withLastMessagesRefreshed(true).find().then(function(conversations) {
						vm.convs = conversations;
						closeWaiting();
						for (var i in conversations) {
							convObj[conversations[i].id] = conversations[i];
						}
					}).catch(console.error.bind(console));
					vm.imUserObj.on('message', function(message, conversation) {
						if (vm.conv && conversation.id == vm.conv.id) {
							vm.msgs.push(message);
							scrollBottom(200);
						}
					});
					vm.imUserObj.on('invited', function(payload, conversation) {
						if (convObj[conversation.id] == null) {
							if (conversation.lastMessage == null) conversation.lastMessage = {
								text: ''
							};
							if (conversation.lastMessageAt == null) conversation.lastMessageAt = new Date();
							vm.convs.unshift(conversation);
							convObj[conversation.id] = conversation;
						}
					});
				}).catch(console.error.bind(console));
			}, function(error) {
				closeWaiting();
				if (error.message)
					alert(error.message);
				else
					alert('登录失败,请检查网络');
			});
		}
	}

	function signOut() {
		AV.User.logOut();
		myApp.loginScreen();
		vm.imUserObj.close().then(function() {
			vm.imUserObj.removeAllListeners();
			vm.imUserObj = null;
			vm.convs = [];
			vm.conv = null;
			vm.msgs = [];
			$$('#feedback-area').val('');
		});
	}

	function signUp(e) {
		e.preventDefault();
		var userName = vm.signUp.userName.trim();
		if (userName == '')
			alert('用户名不能为空！');
		else if (vm.signUp.password != vm.signUp.password2)
			alert('两次密码不一致！');
		else if (vm.signUp.password.length < 6)
			alert('密码最短6位！');
		else {
			showWaiting('注册中 ...');
			var user = new AV.User();
			user.setUsername(vm.signUp.userName);
			user.setPassword(vm.signUp.password);
			user.signUp().then(function(loggedUser) {
				closeWaiting();
				vm.userName = loggedUser.getUsername();
				vm.password = vm.signUp.password;
				vm.userObj = loggedUser;
				alert('注册成功');
				signIn();
			}, function(error) {
				closeWaiting();
				alert(error.message);
			});
		}
	}

	function showWaiting(s) {
		if (window.plus) plus.nativeUI.showWaiting(s);
		else myApp.showPreloader(s);
	}

	function closeWaiting() {
		if (window.plus) plus.nativeUI.closeWaiting();
		else myApp.hidePreloader();
	}
}