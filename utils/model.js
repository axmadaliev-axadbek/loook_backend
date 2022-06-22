import fs from 'fs'
import path from 'path'

function read (filenmae) {
    let data  = fs.readFileSync(path.join(process.cwd(), 'database', filenmae + '.json'), 'utf-8')
    return JSON.parse(data) || []
}

function write(filename, data) {
    fs.writeFileSync(path.join(process.cwd(), 'database', filename + '.json'), JSON.stringify(data, null, 4))
    return true
}

export {
    read,
    write
}