// chrome supports chrome only
// IE supports browser only
// Firefox & Opera support both
var browser = browser || chrome;

var ptakopet = {
    position_left: typeof(localStorage.ptakopet_position_left)=="undefined"?true:localStorage.ptakopet_position_left=='true',
};
if(browser.runtime) {
    ptakopet.getURL = browser.runtime.getURL; 
} else {
    // TODO: test this works only on ptakopet bootstraper
    ptakopet.getURL = function(str) { console.log(str); return str; }
}

$("html").append('<link rel="stylesheet" href="' + ptakopet.getURL("../css/floater.css") + '">');

// fetch floater.html content
$.ajax({
    url: ptakopet.getURL("../html/floater.html"),
    context: document.body
  }).done(function(data) {
    $("html").append(data);
    ptakopet.floater = $('#ptakopet_floater')
    ptakopet.dir_button = $('#ptakopet_dir');
    ptakopet.ready();
  });

ptakopet.refresh_floater_pos = function() {
    // change the actuall position
    ptakopet.floater.css(ptakopet.position_left?'left':'right', '20px');
    ptakopet.floater.css(!ptakopet.position_left?'left':'right', '');

    // change the icon
    ptakopet.position_left?
        ptakopet.dir_button.attr('class', 'fa fa-arrow-right') :
        ptakopet.dir_button.attr('class', 'fa fa-arrow-left');
}

ptakopet.atrap_text_inputs = function() {
    $('input[type=text]').each(function(i, obj) {
        let trigger_id = 'ptakopet_i' + i;
        $('html').append('<img src="' + ptakopet.getURL('../src/logo_bird_mini.png') + '" class="ptakopet_trigger_bird" id="' + trigger_id + '">');
        let trigger_obj = $('#' +trigger_id);

        // add button with hash id
        $(obj).focusin(function(a, b) {
            trigger_obj.css('visibility', 'visible');
            let parent_offset = $(obj).offset();
            trigger_obj.offset({top: parent_offset.top, left: parent_offset.left+200});
            ptakopet.cur_input = $(obj);
        })
        $(obj).focusout(function(a, b) {
            // dirty trick to make the click event fire before the button disappears
            window.setTimeout(function() {
                $('#' +trigger_id).css('visibility', 'hidden');
            }, 100);
        })

        trigger_obj.click(function(a, b) {
            ptakopet.floater.css('visibility', 'visible');
            ptakopet.cur_input.focus();

        })
    });
}

ptakopet.ready = function() {
    ptakopet.refresh_floater_pos();
    ptakopet.atrap_text_inputs();

    // bind top bar buttons
    $("#ptakopet_dir").click(function(e) {
        localStorage.ptakopet_position_left = ptakopet.position_left = !ptakopet.position_left;
        ptakopet.refresh_floater_pos();
    });

    $("#ptakopet_close").click(function(e) {
        console.log(ptakopet.floater.css('visibility'));
        ptakopet.floater.css('visibility', 'hidden');
    });

    // recalculate some html elements urls
    $('.extension_url_src').each(function(i, obj) {
        $(obj).attr('src', ptakopet.getURL($(obj).attr('src')));
    });
}