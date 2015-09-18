var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');
/*
var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    // 获取首页所有的链接
    $('#topic_list .topic_title').each(function (idx, element) {
      var $element = $(element);
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
      var href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrls.push(href);
    });

    //console.log(topicUrls);

    var ep = eventproxy();

    ep.after('topic_html',topicUrls.length, function (topics) {
        console.log(topics)
        topics = topics.map(function(topicPair) {
            var topicUrl = topicPair[0];
            var topicHtml = topicPair[1];
            var $ = cheerio.load(topicHtml)
            return ({
                title:$('.topic_full_title').text().trim(),
                href:topicUrl,
                comment1: $('.reply_content').eq(0).text().trim(),
            });
        });
        console.log('final:');
        console.log(topics)
    });

    topicUrls.forEach(function (topicUrl) {
        superagent.get(topicUrl)
            .end(function (err, res) {
                console.log('fetch '+topicUrl+' successful');
                ep.emit('topic_html',[topicUrl, res.text]);
            });
    });
  });
*/
  var url1 = "https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=ZXgyvI6uhG1QaaFxEVAquhhU&redirect_uri=oob"
  var ep = eventproxy();
  superagent.get(url1)
    .end(function (err, res) {
        if (err) {
            return console.error(err)
        }
        ep.emit('1_re',res.text)
    });

  ep.after('1_re',1, function (text) {
        console.log(text)
        var $ = cheerio.load(text)
        console.log($('input[type="text"]').eq(0).val())
        //console.log($('#Verifier'));
        //console.log($(':input').html())
  });
