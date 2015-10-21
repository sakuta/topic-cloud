describe('Topics cloud tests', function() {
    it('Returns the right color', function() {
        expect(topicCloud.colorMap(55)).toEqual('gray');
        expect(topicCloud.colorMap(10)).toEqual('red');
        expect(topicCloud.colorMap(100)).toEqual('green');
    });
    
    it('Finds the right topic', function() {
        topicCloud.topicData = [
            {
                id: '1751295897__Berlin',
                label: 'Berlin'
            }, {
                id: '231412',
                label: 'Hamburg'
            }
        ];
        var topic = topicCloud.findTopicById('1751295897__Berlin');
        expect(topic.label).toEqual('Berlin');
        
        expect(topicCloud.findTopicById('wrong_id')).toBeNull();
    });
});