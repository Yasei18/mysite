// Получение переменной cookie по имени
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
 
// Настройка AJAX
$(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
});

function like()
{
    var like = $(this);                     // Получаем объект лайка из шаблона
    var type = like.data('type');           // Тип объекта (в нашем случае - feedback)
    var pk = like.data('id');               // Номер объекта в БД
    var action = like.data('action');       // Действие (like/dislike)
 
    $.ajax({
        url : "/" + type + "/" + pk + "/" + action + "/",
        type : 'POST',
        data : { 'obj' : pk },
 
        success : function (json) {
            // Находим элемент like и либо добавляем, либо удаляем класс added
            var like_el = like.find("[id='#l_" + pk + "']");
            let dislike_el = document.getElementById('#dl_' + pk);

            if (like_el.hasClass('added')) {
                // Если найден класс added - убираем его и меняем текст под кнопкой
                like_el.removeClass('added');
                like.find("[data-count='like']").text(json.like_count);
            }
            else {
                // Иначе - добавляем класс и убираем класс у dislike, если он есть
                like_el.addClass('added');
                like.find("[data-count='like']").text(json.like_count);
                if (dislike_el.classList.contains('added')) {
                    dislike_el.classList.remove('added');
                    // Получаем блок, в который записывается количество лайков и вносим новое кол-во.
                    let count_dl = document.getElementById('#dl_count_' + pk);
                    count_dl.innerHTML = json.dislike_count;
                }
            }
        }
    });
 
    return false;
}
 
function dislike()
{
    var dislike = $(this);
    var type = dislike.data('type');
    var pk = dislike.data('id');
    var action = dislike.data('action');
 
    $.ajax({
        url : "/" + type + "/" + pk + "/" + action + "/",
        type : 'POST',
        data : { 'obj' : pk },
 
        success : function (json) {
            // Находим элемент dislike и либо добавляем, либо удаляем класс added
            let like_el = document.getElementById('#l_' + pk);
            var dislike_el = dislike.find("[id='#dl_" + pk + "']");

            if (dislike_el.hasClass('added')) {
                // Если найден класс added - убираем его и меняем текст под кнопкой
                dislike_el.removeClass('added');
                dislike.find("[data-count='dislike']").text(json.dislike_count);
            }
            else {
                // Иначе - добавляем класс и убираем класс у like, если он есть
                dislike_el.addClass('added');
                dislike.find("[data-count='dislike']").text(json.dislike_count);
                if (like_el.classList.contains('added')) {
                    like_el.classList.remove('added');
                    // Получаем блок, в который записывается количество лайков и вносим новое кол-во.
                    let count_l = document.getElementById('#l_count_' + pk);
                    count_l.innerHTML = json.like_count;
                }
            }
        }
    });
 
    return false;
}

setInterval(function () {
    let id_list = [];

    // Получаем data-id всех элементов like/dislike
    $('[data-type="like"]').each(function(e) {
        var $el = $(this);
        id_list.push($el.attr('data-id'));
    })

    id_list.forEach(function(pk) {
        $.ajax({
            url: "/feedback/" + pk + "/update/",
            type: 'POST',
            data: {'check': true},

            success: function (json) {
                // Получаем блок, в который записывается количество лайков и вносим новое кол-во.
                let count_l = document.getElementById('#l_count_' + pk);
                count_l.innerHTML = json.like_count;
                // Получаем блок, в который записывается количество дизлайков и вносим новое кол-во.
                let count_dl = document.getElementById('#dl_count_' + pk);
                count_dl.innerHTML = json.dislike_count;
            }
        });
    });
}, 10000);
 
// Подключение обработчиков
$(function() {
    $('[data-action="like"]').click(like);
    $('[data-action="dislike"]').click(dislike);
});