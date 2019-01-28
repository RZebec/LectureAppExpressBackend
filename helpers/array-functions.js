module.exports = {
    groupBy: Array.prototype.groupBy = function (prop) {
        var index = -1
        var val = -1
    
        var groups = []
    
        this.forEach(item => {
            if (item[prop] != val) {
                val = item[prop]
                index++
                groups.push({
                    Key: val,
                    Content: [item]
                })
            } else {
                groups[index].Content.push(item)
            }
        })
    
        return groups
    }
}