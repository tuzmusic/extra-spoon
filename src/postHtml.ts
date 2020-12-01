import axios, {AxiosRequestConfig} from 'axios'

/*
PUT /repos/{owner}/{repo}/contents/{path}

Parameters
Name	    Type	In	        Description
accept	    string	header      Setting to application/vnd.github.v3+json is recommended.
owner	    string	path
repo	    string	path
path	    string	path        path+ parameter
message	    string	body        Required. The commit message.
content	    string	body        Required. The new file content, using Base64 encoding.
sha	        string	body        Required if you are updating a file. The blob SHA of the file being replaced.
branch	    string	body        The branch name. Default: the repository’s default branch (usually master)
committer	object	body        The person that committed the file. Default: the authenticated user.
* */

export async function postPage(html: string, url: string) {
    const options: AxiosRequestConfig = {
        method: 'PUT',
        url: 'https://api.github.com/repos/tuzmusic/extra-spoon/contents/parsed_pages' + url,
        params: {
            accept: 'application/vnd.github.v3+json',
            message: 'Add parsed version of ' + url,
            content: html,
            branch: 'parsed_pages'
        }
    };
    await axios.request(options);
}