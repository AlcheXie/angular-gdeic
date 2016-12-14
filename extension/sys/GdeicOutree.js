module.exports = function(ngModule) {

    ngModule.factory('GdeicOutree', GdeicOutreeFactory);

    GdeicOutreeFactory.$inject = ['$q', '$gdeic', '$gdeicSysResource'];

    function GdeicOutreeFactory($q, $gdeic, $gdeicSysResource) {
        class GdeicOutree {
            constructor(outree) {
                let _source = outree;

                this.Id = outree.Id
                this.OuName = outree.OuName;
                this.DnName = outree.DnName;
                this.ParentId = outree.ParentId;
                this.SubOus = null;
                this.Accounts = null;

                this.getSource = () => _source;
            }

            setSubOus() {
                let _outree = this.getSource();
                this.SubOus = _outree.SubOus.map((x, i) => new GdeicOutree(_outree.SubOus[i]));
            }

            setAccounts() {
                let deferred = $q.defer();

                if (!this.Accounts) {
                    $gdeic.httpPromise($gdeicSysResource.queryOuAccounts({ ouId: this.Id }))
                        .then(data => {
                            this.Accounts = data;
                            deferred.resolve(data);
                        }, deferred.reject);
                } else {
                    deferred.resolve(this.Accounts);
                }

                return deferred.promise;
            }
        }

        return GdeicOutree;
    }
};