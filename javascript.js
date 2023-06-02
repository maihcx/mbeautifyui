var MBUI = MBeautifyUI();
var Controller = MBUI.Controller;
var Message = MBUI.Message;
window.onload = function() {
    // tooltip
    MBUI.renderAutoTooltip('tooltip-content');

    // theme
    Controller.setTheme(0);
    Controller.bindEvents('#dark_light_switch', {
        change: e => {
            let theme_value = e.target.value;
            Controller.setTheme(theme_value);
        }
    });
    MBUI.EVENTS.onThemeChanged(function(data) {
        console.log(data.THEME);
    });

    // Message
    // Message - NOTIFICATION
    Controller.bindEvents('#btn_messages_notification', {
        click: e => {
            Message.showDialog({
                type: Message.type.NOTIFICATION, 
                title: 'Thông báo!', 
                contentText: "Đây là nội dung của hộp thoại thông báo", events: {
                    confirmed: function() {
                        console.log('closed');
                    }
                }
            });
        }
    });
    // Message - QUESTION
    Controller.bindEvents('#btn_messages_question', {
        click: e => {
            Message.showDialog({
                type: Message.type.QUESTION, 
                title: 'Thông báo!', 
                contentText: "Vui lòng chọn 'Huỷ' hoặc 'OK'", events: {
                    confirming: function(obj) {
                        // không cho phép đóng hộp thoại
                        // obj.cancel = true;

                        // buộc đóng hộp thoại
                        // obj.close();
                        console.log(obj);
                    },
                    confirmed: function(value) {
                        console.log(value);
                    }
                }
            });
        }
    });
    
}