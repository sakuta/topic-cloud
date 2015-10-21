/**
 * Topics json source url
 *
 * @const
 * @type {string}
 */
var TOPICS_SRC = 'https://gist.githubusercontent.com/grahamscott/65b43572ad18c5fbdd87/raw/00a632b43ea6bd36783c16149324139a9e764447/topics.json',
    /**
     * This defines how many sizes should be in the topic cloud
     *
     * @const
     * @type {integer}
     */
    SIZES_COUNT = 6,
    /**
     * Sentiment number when topic should be green
     *
     * @const
     * @type {integer}
     */
    GREEN_SENTIMENT_SCORE = 60,
    /**
     * Sentiment number when topic should be red
     *
     * @const
     * @type {integer}
     */
    RED_SENTIMENT_SCORE = 40;

/**
 * Simple object for creating topic class
 */
var topicCloud = {
    topicData: [],
    /**
     * Return color by sentiment score
     *
     * @param {number} sentimentScore 
     * @return {string} valid css color.
     */
    colorMap: function (sentimentScore) {
        if (sentimentScore > GREEN_SENTIMENT_SCORE) {
            return 'green';
        } else if (sentimentScore < RED_SENTIMENT_SCORE) {
            return 'red';                
        } else {
            return 'gray';
        }
    },
    /**
     * Searches object in topicData array by id property
     *
     * @param {string} id
     * @return {Object|null}
     */
    findTopicById: function(id) {
        for (var i = 0, len = topicCloud.topicData.length; i < len; i++) {
            if (topicCloud.topicData[i].id === id) {
                return topicCloud.topicData[i]; 
            }
        }
        return null; // The object was not found
    },
    /**
     * Displays metadata of clicked item
     */
    showMetadata: function() {
        var topicId = $(this).attr('data-topic-id'),
            topic = topicCloud.findTopicById(topicId);
            console.log(topic);
        if (topic) {
            $('#metadata').html(
                'Information on topic <b>' + topic.label + '</b>' +
                '<br/><br/>' +
                'Positive mentions : <span style="color:green">' + (topic.sentiment.positive || 0) + '</span><br/>' +
                'Neutral mentions : <span style="color:gray">' + (topic.sentiment.neutral || 0) + '</span><br/>' +
                'Negative mentions : <span style="color:red">' + (topic.sentiment.negative || 0) + '</span>'
            );
        }
    },
    /**
     * Creates topic cloud
     */
    create: function () {
        $.getJSON(TOPICS_SRC, function(data) {
            var words = [];
            $.each(data.topics, function(key, topic) {
                topicCloud.topicData = data.topics;
                words.push({
                    text: topic.label,
                    weight: topic.volume,
                    handlers: {
                        click: topicCloud.showMetadata
                    },
                    html:{
                        style: 'color:' + topicCloud.colorMap(topic.sentimentScore),
                        'data-topic-id': topic.id                    
                    }
                });
            });
            
            $('#keywords').jQCloud(words, {
                width: 500,
                height: 350,
                steps: SIZES_COUNT
            });
        });    
    }
};


// Run the app
$(function() {
    topicCloud.create();
});
